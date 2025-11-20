import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, message } = await req.json()
    const userQuery = query || message

    if (!userQuery) {
      throw new Error('Query o message es requerida')
    }

    console.log('=== NUEVA CONSULTA ===')
    console.log('Mensaje:', userQuery)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Generar embedding
    const openaiResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: userQuery,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI Embeddings error: ${openaiResponse.status}`)
    }

    const embeddingData = await openaiResponse.json()
    const embedding = embeddingData.data[0].embedding

    console.log('Embedding generado, dimensión:', embedding.length)

    // 2. Buscar documentos CON IMÁGENES
    const { data: documents, error } = await supabaseClient.rpc('match_documents_with_images', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 5
    })

    if (error) {
      console.error('Error en match_documents_with_images:', error)
      throw error
    }

    console.log('Documentos encontrados:', documents?.length || 0)
    
    if (documents && documents.length > 0) {
      console.log('Primer documento:', documents[0]?.metadata?.nombre)
    }

    // 3. Construir contexto con marcadores
    const context = documents.map((doc: any, idx: number) => {
      const meta = doc.metadata || {}
      return `[LUGAR-${idx}]
Nombre: ${meta.nombre || 'Sin nombre'}
${doc.content}
Ubicación: ${meta.direccion || 'No disponible'}
Tipo: ${meta.type || 'No especificado'}`
    }).join('\n\n---\n\n')

    console.log('Contexto construido, longitud:', context.length)

    // 4. Generar respuesta con GPT
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente turístico experto de CDMX para el Mundial 2026. 

REGLAS:
1. NO menciones URLs, imágenes ni "Ver en mapa"
2. Después de cada lugar, agrega: [VER-LUGAR-X] en nueva línea
3. Sé detallado con precios, servicios y categorías

FORMATO:
1. **Nombre del Lugar**
   - Categoría: X estrellas
   - Descripción detallada
   - Precio: $$
   - Ubicación: Dirección completa
[VER-LUGAR-0]

2. **Otro Lugar**
   - Información completa...
[VER-LUGAR-1]

Contexto:
${context}`
          },
          {
            role: 'user',
            content: userQuery
          }
        ],
        temperature: 0.7,
        max_tokens: 600
      }),
    })

    if (!gptResponse.ok) {
      throw new Error(`OpenAI error: ${gptResponse.status}`)
    }

    const gptData = await gptResponse.json()
    const answer = gptData.choices[0].message.content

    console.log('Respuesta GPT generada')

    // 5. Extraer imágenes con ID
    const images = documents
      .filter((doc: any) => doc.metadata?.imagen_url)
      .map((doc: any, idx: number) => {
        const meta = doc.metadata
        const lat = meta.latitude || meta.lat
        const lng = meta.longitude || meta.lng || meta.lon
        
        return {
          id: idx,
          url: meta.imagen_url,
          nombre: meta.nombre,
          tipo: meta.type,
          map_url: lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null,
          direccion: meta.direccion,
          categoria_estrellas: meta.categoria_estrellas,
          rango_precios: meta.rango_precios
        }
      })

    console.log('Imágenes procesadas:', images.length)

    return new Response(
      JSON.stringify({
        response: answer,
        images: images.slice(0, 6),
        sources: documents.map((doc: any) => ({
          nombre: doc.metadata?.nombre,
          tipo: doc.metadata?.type,
        })),
        kml_files: [],
        debug: {
          docs_found: documents.length,
          images_found: images.length
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('ERROR:', error.message)
    
    return new Response(
      JSON.stringify({
        response: 'Lo siento, hubo un problema. 🔌',
        images: [],
        kml_files: [],
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
