import os
from supabase import create_client
from openai import OpenAI
from tqdm import tqdm
import time

# Configuración
SUPABASE_URL = "https://ksiiidnvtktlowlhtebs.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaWlpZG52dGt0bG93bGh0ZWJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDgxMjEzMywiZXhwIjoyMDc2Mzg4MTMzfQ.z2qoL9pYqyFvYzO_wW-WRknxx-fo0Z7o69M-PezTOH0"
OPENAI_API_KEY = "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"

# Inicializar clientes
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_embedding(text):
    """Genera embedding usando OpenAI"""
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text[:8000]
    )
    return response.data[0].embedding

def regenerate_all_embeddings():
    """Regenera todos los embeddings"""
    print("Obteniendo documentos...")
    
    response = supabase.table('documents').select('id, content').execute()
    documents = response.data
    
    print(f"Total documentos: {len(documents)}")
    print(f"Costo estimado: ${len(documents) * 0.0001:.2f} USD")
    
    confirm = input("\nContinuar? (y/n): ")
    if confirm.lower() != 'y':
        print("Cancelado")
        return
    
    print("\nRegenerando embeddings...\n")
    
    success = 0
    errors = 0
    
    for doc in tqdm(documents):
        try:
            embedding = generate_embedding(doc['content'] or '')
            
            supabase.table('documents').update({
                'embedding': embedding
            }).eq('id', doc['id']).execute()
            
            success += 1
            time.sleep(0.02)
            
        except Exception as e:
            print(f"\nError en doc {doc['id']}: {e}")
            errors += 1
            time.sleep(1)
    
    print(f"\nCompletado!")
    print(f"Exitos: {success}")
    print(f"Errores: {errors}")

if __name__ == "__main__":
    regenerate_all_embeddings()
