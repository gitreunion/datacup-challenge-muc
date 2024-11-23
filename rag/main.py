from flask import Flask, request, jsonify
from flask_cors import CORS
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack import Document
from haystack.components.embedders import SentenceTransformersTextEmbedder
from haystack.components.retrievers.in_memory import InMemoryEmbeddingRetriever
from haystack.components.builders import PromptBuilder
import os
from haystack.components.generators import OpenAIGenerator
from haystack import Pipeline
import glob
from haystack.components.embedders import SentenceTransformersDocumentEmbedder
import re
import requests

app = Flask(__name__)
CORS(app)

def enrich_query_with_history(query, history):
    """
    Combine l'historique de chat avec la nouvelle requête.

    :param query: La nouvelle requête de l'utilisateur.
    :param history: L'historique de chat précédent.

    :return: La requête enrichie avec l'historique de chat.
    """
    if not history:
        return query
    history_text = " ".join([f"Q: {q} A: {a}" for q, a in history])
    return f"{history_text} Nouvelle question: {query}"

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
    siret = enterprise_info.get("siret", "non spécifié")
    date_creation = enterprise_info.get("datecreationetablissement", "non spécifié")
    address = f"{enterprise_info.get('numerovoieetablissement', 'non spécifié')} {enterprise_info.get('typevoieetablissement', 'non spécifié')} {enterprise_info.get('libellevoieetablissement', 'non spécifié')}".strip()
    city = enterprise_info.get("libellecommuneetablissement", "non spécifié")
    postal_code = enterprise_info.get("codepostaletablissement", "non spécifié")
    activity = enterprise_info.get("activiteprincipaleetablissement", "non spécifié")
    employee_range = enterprise_info.get("trancheeffectifsunitelegale", "non spécifié")
    
    return (
        f"L'entreprise avec le SIRET {siret} a été créée le {date_creation}. Elle est située au "
        f"{address}, {postal_code} {city}. Son activité principale est '{activity}'. "
        f"Elle a une tranche d'effectifs de '{employee_range}'."
    )

# Initialisation de l'historique de chat
chat_history = []

# Initialisation du DocumentStore
document_store = InMemoryDocumentStore()

# Charger les documents dans Vot le DocumentStore
dataset_path = "dataset/*.txt"
docs = load_dataset(dataset_path)

# Incorporer les documents
doc_embedder = SentenceTransformersDocumentEmbedder(model="sentence-transformers/all-MiniLM-L6-v2")
doc_embedder.warm_up()

# Écrire les documents dans le DocumentStore
docs_with_embeddings = doc_embedder.run(docs)
document_store.write_documents(docs_with_embeddings["documents"])

# Initialisation des composants du pipeline RAG
text_embedder = SentenceTransformersTextEmbedder(model="sentence-transformers/all-MiniLM-L6-v2")
retriever = InMemoryEmbeddingRetriever(document_store)

template = """
Given the following information, answer the question.

Context:
{% for document in documents %}
    {{ document.content }}
{% endfor %}

Question: {{question}}
Answer:
"""

prompt_builder = PromptBuilder(template=template)

# Assuming the OPENAI_API_KEY is already set in the environment
generator = OpenAIGenerator(model="gpt-4o-mini")

basic_rag_pipeline = Pipeline()
# Add components to your pipeline
basic_rag_pipeline.add_component("text_embedder", text_embedder)
basic_rag_pipeline.add_component("retriever", retriever)
basic_rag_pipeline.add_component("prompt_builder", prompt_builder)
basic_rag_pipeline.add_component("llm", generator)

# Connect the components
basic_rag_pipeline.connect("text_embedder.embedding", "retriever.query_embedding")
basic_rag_pipeline.connect("retriever", "prompt_builder.documents")
basic_rag_pipeline.connect("prompt_builder", "llm")

@app.route('/chat_completion', methods=['POST'])
def chat_completion():
    data = request.json
    user_query = data.get('user_message', '')
    siret_info = None  # Initialize to ensure it's always defined

    # Détection du numéro SIRET dans la requête utilisateur
    regex = r"\b\d{14}\b"
    if re.search(regex, user_query):
        siret_number = re.search(regex, user_query).group()
        print(f"Numéro SIRET détecté : {siret_number}")
        
        # URL to fetch company information based on SIRET number
        url = compose_url_fetch_siret_info(siret_number)
        try:
            response = requests.get(url)
            if response.status_code == 200:
                siret_info = response.json()
                if siret_info.get("total_count", 0) > 0:
                    enterprise_info = siret_info["results"][0]
                    # Extract relevant data and replace None values with "Non spécifié"
                    enterprise_details = compose_enterprise_details(enterprise_info)

                    # Append to user_query
                    user_query += f" Voici les informations sur cette entreprise : {enterprise_details}"

                else:
                    user_query += " Je n'ai trouvé aucune information sur ce numéro de SIRET."
            else:
                user_query += f" Erreur lors de la récupération des informations (statut {response.status_code})."
        except requests.RequestException as e:
            user_query += f" Une erreur est survenue lors de la connexion à l'API : {str(e)}."
    else:
        print("Aucun numéro SIRET détecté dans la requête utilisateur.")

    # Enrichir la requête avec l'historique
    enriched_query = enrich_query_with_history(user_query, chat_history)
    print(f"Enriched query: {enriched_query}")

    # Exécuter le pipeline RAG
    response = basic_rag_pipeline.run({"text_embedder": {"text": enriched_query}, "prompt_builder": {"question": enriched_query}})
    reply = response["llm"]["replies"][0]
    chat_history.append((user_query, reply))

    return jsonify({"reply": reply, "siret_info": siret_info})

if __name__ == "__main__":
    app.run(port=9001, debug=True)
