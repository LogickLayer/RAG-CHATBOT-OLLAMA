from fastapi import FastAPI
from pydantic import BaseModel
from server.rag_pipeline import get_answer, create_vectorstore
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
create_vectorstore()

class Query(BaseModel):
    question: str

@app.post("/ask")
def ask_question(query: Query):
    answer = get_answer(query.question)
    return {"answer": answer}
