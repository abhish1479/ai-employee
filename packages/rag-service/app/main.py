import os, math
from fastapi import FastAPI
from pydantic import BaseModel
from .db import engine
from sqlalchemy import text
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
app = FastAPI(title="RAG Service")

class UpsertReq(BaseModel):
  agent_id: str
  namespace: str
  content: str
  metadata: dict = {}

@app.post("/embed/upsert")
def upsert(r: UpsertReq):
  emb = client.embeddings.create(model="text-embedding-3-small", input=r.content).data[0].embedding
  vec = "[" + ",".join([str(x) for x in emb]) + "]"
  with engine.begin() as conn:
    conn.execute(text("""INSERT INTO doc_chunks(agent_id,namespace,content,embedding,metadata)
                         VALUES(:agent_id,:namespace,:content,:embedding,:metadata)"""),
                 {"agent_id": r.agent_id, "namespace": r.namespace, "content": r.content, "embedding": vec, "metadata": r.metadata})
  return {"ok": True}

class SearchReq(BaseModel):
  agent_id: str
  namespace: str
  query: str
  top_k: int = 5

@app.post("/embed/search")
def search(r: SearchReq):
  qemb = client.embeddings.create(model="text-embedding-3-small", input=r.query).data[0].embedding
  vec = "[" + ",".join([str(x) for x in qemb]) + "]"
  with engine.begin() as conn:
    rows = conn.execute(text("""
      SELECT content, metadata, 1 - (embedding <=> :qvec) AS score
      FROM doc_chunks
      WHERE agent_id=:agent_id AND namespace=:ns
      ORDER BY embedding <=> :qvec
      LIMIT :k
    """), {"qvec": vec, "agent_id": r.agent_id, "ns": r.namespace, "k": r.top_k}).mappings().all()
  return {"results": list(rows)}
