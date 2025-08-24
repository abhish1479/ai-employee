CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS doc_chunks(
  id SERIAL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  namespace TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_vec ON doc_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_meta ON doc_chunks USING GIN (metadata jsonb_path_ops);

CREATE TABLE IF NOT EXISTS convo_summaries(
  id SERIAL PRIMARY KEY,
  thread_key TEXT NOT NULL,
  account_id TEXT,
  agent_id TEXT,
  summary TEXT NOT NULL,
  entities JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);
