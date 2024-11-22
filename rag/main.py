from haystack.document_stores.in_memory import InMemoryDocumentStore
from datasets import load_dataset
from haystack import Document
from haystack.components.embedders import SentenceTransformersTextEmbedder
from haystack.components.retrievers.in_memory import InMemoryEmbeddingRetriever
from haystack.components.builders import PromptBuilder
import os
from getpass import getpass
from haystack.components.generators import OpenAIGenerator
from haystack import Pipeline
import glob
from haystack.components.embedders import SentenceTransformersDocumentEmbedder

chat_history = []

def enrich_query_with_history(query, history):
    """Combine l'historique de chat avec la nouvelle requête."""
    if not history:
        return query
    history_text = " ".join([f"Q: {q} A: {a}" for q, a in history])
    return f"{history_text} Nouvelle question: {query}"


document_store = InMemoryDocumentStore()

dataset_path = "dataset/*.txt"
files = glob.glob(dataset_path)
docs = []
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        docs.append(Document(content=content, meta={"source": file}))


doc_embedder = SentenceTransformersDocumentEmbedder(model="sentence-transformers/all-MiniLM-L6-v2")
doc_embedder.warm_up()

docs_with_embeddings = doc_embedder.run(docs)
document_store.write_documents(docs_with_embeddings["documents"])

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

if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = getpass("Enter OpenAI API key:")
generator = OpenAIGenerator(model="gpt-4o-mini")

basic_rag_pipeline = Pipeline()
# Add components to your pipeline
basic_rag_pipeline.add_component("text_embedder", text_embedder)
basic_rag_pipeline.add_component("retriever", retriever)
basic_rag_pipeline.add_component("prompt_builder", prompt_builder)
basic_rag_pipeline.add_component("llm", generator)

# Now, connect the components to each other
basic_rag_pipeline.connect("text_embedder.embedding", "retriever.query_embedding")
basic_rag_pipeline.connect("retriever", "prompt_builder.documents")
basic_rag_pipeline.connect("prompt_builder", "llm")

while True:
    user_query = input("Votre question : ")

    

    enriched_query = enrich_query_with_history(user_query, chat_history)

    response = basic_rag_pipeline.run({"text_embedder": {"text": enriched_query}, "prompt_builder": {"question": enriched_query}})

    print(response["llm"]["replies"][0])

    chat_history.append((user_query, response["llm"]["replies"][0]))