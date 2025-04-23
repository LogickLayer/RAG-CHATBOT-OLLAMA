from langchain.document_loaders import DirectoryLoader, PyPDFLoader, WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import HuggingFaceHub
from langchain_community.llms import Ollama
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin, urlparse
import os

# Recursively crawl website and collect URLs
def get_all_links(base_url, visited=None, depth=2):
    if visited is None:
        visited = set()
    if depth == 0 or base_url in visited:
        return []

    visited.add(base_url)
    urls = [base_url]

    try:
        response = requests.get(base_url)
        soup = BeautifulSoup(response.text, "html.parser")
        for link in soup.find_all("a", href=True):
            href = link['href']
            full_url = urljoin(base_url, href)
            # Same domain filter
            if urlparse(full_url).netloc == urlparse(base_url).netloc:
                urls.extend(get_all_links(full_url, visited, depth - 1))
    except Exception as e:
        print(f"Error crawling {base_url}: {e}")

    return list(set(urls))

def create_vectorstore():
    print("Loading PDFs...")
    
    pdf_loader = DirectoryLoader("./server/data/customer_support_docs/Insurance PDFs", glob="**/*.pdf", loader_cls=PyPDFLoader)
    pdf_docs = pdf_loader.load()

    print("pdf_docs", pdf_docs)

    print("Crawling website...")
    base_url = "https://www.angelone.in/support"  # replace this
    urls = get_all_links(base_url, depth=2)  # depth can be increased
    web_loader = WebBaseLoader(urls)
    web_docs = web_loader.load()

    print("Splitting documents...")
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    all_docs = pdf_docs + web_docs
    chunks = splitter.split_documents(all_docs)

    print("Generating embeddings...")
    # embeddings = OpenAIEmbeddings()


    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.from_documents(chunks, embeddings)
    vectorstore.save_local("vector_store")
    print("Vector store created and saved!")

def load_vectorstore():
    return FAISS.load_local(
        "./vector_store", 
        HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2"), 
        allow_dangerous_deserialization=True
    )

def get_answer(question: str):
    vs = load_vectorstore()
    retriever = vs.as_retriever(search_kwargs={"k": 2})
    docs = retriever.get_relevant_documents(question)
    print(f"Retrieved {len(docs)} documents:")
    for d in docs:
        print(d.page_content[:200])  # Print first 200 chars of each

    # Combine the retrieved documents into a single context
    context = "\n\n".join(doc.page_content for doc in docs)

    # Define a prompt to check relevance
    relevance_prompt = PromptTemplate.from_template("""
    You are an intelligent assistant. Given the context from documents below,
    determine if the user's question is related to the content.

    --- CONTEXT START ---
    {context}
    --- CONTEXT END ---

    QUESTION:
    {question}

    Is this question relevant to the context? Only answer "Yes" or "No".
    """)

    relevance_chain = LLMChain(
        llm=Ollama(model="mistral", temperature=0),
        prompt=relevance_prompt
    )

    relevance_response = relevance_chain.run(context=context, question=question).strip().lower()

    if "yes" not in relevance_response:
        return "I don't know"
    

    llm = Ollama(model="mistral", temperature=0.3)
    
    chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever, return_source_documents=True)

    result = chain({"query": question})  # Use dict-based call instead of .run()

    source_docs = result.get("source_documents", [])
    answer = result.get("result")

    if not source_docs:
        return "I don't know"

    return answer
  