# 🧠 RAG Chatbot Application

A full-stack Retrieval-Augmented Generation (RAG) chatbot application that leverages a **React + Vite** frontend, a **Python** backend, and a **self-hosted Ollama** LLM to deliver contextual, high-performance AI conversations enhanced by custom knowledge sources.

---

## 🔧 Tech Stack

- 🧩 **Frontend**: React + Vite  
- 🐍 **Backend**: Python (FastAPI/Flask/Django — customize as needed)  
- 🧠 **LLM**: Self-hosted Ollama  
- 📄 **RAG Pipeline**: Embedding-based retrieval system  
- 🗃️ **Vector Store**: (e.g., FAISS, Chroma, Weaviate — customize if used)  

---

## 🚀 Features

- 🔍 **Contextual Search**: Augments chatbot responses using embedded documents  
- 💬 **Natural Conversation**: Chat interface powered by Ollama LLM  
- 📚 **Knowledge Injection**: Bring your own docs and PDFs  
- ⚙️ **Modular Architecture**: Frontend and backend are loosely coupled  
- 🔐 **Local-Only Option**: Entire pipeline can run offline with self-hosted LLM  

---


---

## 🛠️ Setup Instructions

### 1. 🧠 Set Up Ollama Locally

Install and run Ollama:

```bash
# Install Ollama
brew install ollama

# Run your desired model (example: llama3)
ollama run llama3

```
---


### 2. 🧠 Set Up Python backend

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run backend (adjust if using FastAPI/Flask/etc.)
uvicorn server.main:app --reload --port 8000

---



### 3. ⚛️ Set Up React + Vite Frontend
cd frontend
npm install
npm run dev

Frontend will run at http://localhost:5173.

---


## Sample API call

``` bash 
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "How to open demat account?"}'
  ```

---


## To-Do / Enhancements

 Add document uploader (PDF, TXT)

 Implement user chat history persistence

 Add authentication (optional)

 Dockerize for full deployment

---

## Contact
Feel free to reach out for feedback or collaborations!
