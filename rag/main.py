import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack import Document
from haystack.components.embedders import SentenceTransformersDocumentEmbedder
from haystack.components.retrievers.in_memory import InMemoryEmbeddingRetriever
from haystack.components.builders import PromptBuilder
from haystack import Pipeline
from mistralai import Mistral
import glob
import re
import requests

app = Flask(__name__)
CORS(app)

def enrich_query_with_history(query, history):
    """
    Combine chat history with the new query.

    :param query: The new user query.
    :param history: The previous chat history.

    :return: The query enriched with chat history.
    """
    if not history:
        return query
    history_text = " ".join([f"Q: {q} A: {a}" for q, a in history])
    return f"{history_text} New question: {query}"

def load_dataset(dataset_path):
    """
    Load the dataset from the specified path and return a list of Document objects.

    :param dataset_path: The path to the dataset files.

    :return: A list of Document objects.
    """
    files = glob.glob(dataset_path)
    docs = []
    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            docs.append(Document(content=content, meta={"source": file}))
    return docs

# Initialize chat history
chat_history = []

# Initialize the DocumentStore
document_store = InMemoryDocumentStore()

dataset_path = "./dataset/*.txt"  # Make sure this matches your dataset location
docs = load_dataset(dataset_path)

# Embed documents
doc_embedder = SentenceTransformersDocumentEmbedder(model="sentence-transformers/all-MiniLM-L6-v2")
doc_embedder.warm_up()

# Write documents to DocumentStore
docs_with_embeddings = doc_embedder.run(docs)
document_store.write_documents(docs_with_embeddings["documents"])

# Setup retriever and other components
retriever = InMemoryEmbeddingRetriever(document_store)

# Define the prompt template
template = """
Answer the question simply, be concise in your responses and use the following information.

Context:
{% for document in documents %}
    {{ document.content }}
{% endfor %}

Question: {{question}}
Answer:
"""

# Setup prompt builder
prompt_builder = PromptBuilder(template=template)

# Create the pipeline
basic_rag_pipeline = Pipeline()
basic_rag_pipeline.add_component("retriever", retriever)
basic_rag_pipeline.add_component("prompt_builder", prompt_builder)

# Initialize Mistral client
api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-large-latest"
mistral_client = Mistral(api_key=api_key)

def compose_url_fetch_siret_info(siret_number):
    """
    Compose the URL to fetch company information based on SIRET number.
    
    :param siret_number: The SIRET number to search for.

    :return: The URL to fetch company information based on SIRET number.
    """
    return f"https://data.regionreunion.com/api/explore/v2.1/catalog/datasets/base-sirene-v3-lareunion/records?where=siret='{siret_number}'&limit=1"

def compose_enterprise_details(enterprise_info):
    """
    Compose the enterprise details string from the provided information.

    :param enterprise_info: The information about the enterprise.

    :return: The enterprise details string.
    """
    siret = enterprise_info.get("siret", "not specified")
    date_creation = enterprise_info.get("datecreationetablissement", "not specified")
    address = f"{enterprise_info.get('numerovoieetablissement', 'not specified')} {enterprise_info.get('typevoieetablissement', 'not specified')} {enterprise_info.get('libellevoieetablissement', 'not specified')}".strip()
    city = enterprise_info.get("libellecommuneetablissement", "not specified")
    postal_code = enterprise_info.get("codepostaletablissement", "not specified")
    activity = enterprise_info.get("activiteprincipaleetablissement", "not specified")
    employee_range = enterprise_info.get("trancheeffectifsunitelegale", "not specified")
    
    return (
        f"The company with SIRET {siret} was created on {date_creation}. It is located at "
        f"{address}, {postal_code} {city}. Its main activity is '{activity}'. "
        f"It has an employee range of '{employee_range}'."
    )

@app.route('/chat_completion', methods=['POST'])
def chat_completion():
    """
    Handle user input and return response based on RAG pipeline.
    :return: The response from the chatbot.
    """
    data = request.json
    user_query = data.get('user_message', '')
    siret_info = None  # Initialize to ensure it's always defined

    # Detect SIRET number in the user query
    regex = r"\b\d{14}\b"
    if re.search(regex, user_query):
        siret_number = re.search(regex, user_query).group()
        print(f"SIRET number detected: {siret_number}")
        
        # URL to fetch company information based on SIRET number
        url = compose_url_fetch_siret_info(siret_number)
        try:
            response = requests.get(url)
            if response.status_code == 200:
                siret_info = response.json()
                if siret_info.get("total_count", 0) > 0:
                    enterprise_info = siret_info["results"][0]
                    enterprise_details = compose_enterprise_details(enterprise_info)
                    user_query += f" Here are the details about this company: {enterprise_details}"
                else:
                    user_query += " No information found for this SIRET number."
            else:
                user_query += f" Error retrieving information (status {response.status_code})."
        except requests.RequestException as e:
            user_query += f" An error occurred while connecting to the API: {str(e)}."
    else:
        print("No SIRET number detected in the user query.")

    # Enrich the query with chat history
    enriched_query = enrich_query_with_history(user_query, chat_history)
    print(f"Enriched query: {enriched_query}")

    # Use the document store to fetch relevant documents
    retrieved_docs = document_store.query(enriched_query, top_k=3)
    documents = [doc.content for doc in retrieved_docs]

    # Make a request to Mistral API
    chat_response = mistral_client.chat.complete(
        model=model,
        messages=[
            {"role": "user", "content": enriched_query}
        ]
    )
    
    reply = chat_response.choices[0].message.content

    # Add to chat history
    chat_history.append((user_query, reply))

    return jsonify({"reply": reply, "siret_info": siret_info, "documents": documents})

@app.route('/history', methods=['GET'])
def get_chat_history():
    """
    Return the chat history.
    
    :return: The chat history.
    """
    return jsonify({"history": chat_history})

if __name__ == "__main__":
    app.run(port=9001, debug=True)
