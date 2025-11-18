-- Crear tablas RAG en proyecto real (sin afectar tablas existentes)

-- Crear extensión vector si no existe
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla para documentos RAG
CREATE TABLE IF NOT EXISTS rag_documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  source_table TEXT,
  source_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para embeddings
CREATE TABLE IF NOT EXISTS rag_embeddings (
  id BIGSERIAL PRIMARY KEY,
  document_id BIGINT REFERENCES rag_documents(id) ON DELETE CASCADE,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsqueda de vectores
CREATE INDEX IF NOT EXISTS rag_embeddings_embedding_idx ON rag_embeddings 
USING ivfflat (embedding vector_cosine_ops);

-- Función para búsqueda semántica
CREATE OR REPLACE FUNCTION match_rag_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.78,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.content,
    d.metadata,
    1 - (e.embedding <=> query_embedding) AS similarity
  FROM rag_documents d
  JOIN rag_embeddings e ON d.id = e.document_id
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Verificar que las tablas se crearon
SELECT 'RAG tables created successfully' AS result;
