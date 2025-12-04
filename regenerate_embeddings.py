import os
from supabase import create_client
from openai import OpenAI
from tqdm import tqdm
import time

# Configuración - usar variables de entorno
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ksiiidnvtktlowlhtebs.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

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
