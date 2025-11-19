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
    const { query } = await req.json()

    if (!query) {
      throw new Error('Query es requerida')
    }

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
        input: query,
      }),
    })

    const { data: embeddingData } = await openaiResponse.json()
    const embedding = embeddingData[0].embedding

    // 2. Buscar documentos
    const { data: documents, error } = await supabaseClient.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 5
    })

    if (error) throw error

    // DEBUG: Log para ver qué devuelve
    console.log('Documents found:', documents?.length || 0)
    console.log('First doc metadata:', documents?.[0]?.metadata)

    // 3. Construir contexto
    const context = documents.map((doc: any) => {
      const meta = doc.metadata || {}
      return `${doc.content}
[Imagen: ${meta.imagen_url || 'No disponible'}]
[Ubicación: ${meta.direccion || 'No disponible'}]`
    }).join('\n\n---\n\n')

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
            content: `Eres un asistente turístico de CDMX para el Mundial 2026. 
Responde en español de forma amigable.
Al mencionar lugares, di "📍 Ver en mapa" pero NO escribas el URL completo.`
          },
          {
            role: 'user',
            content: `Contexto:\n${context}\n\nPregunta: ${query}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    })

    const gptData = await gptResponse.json()
    const answer = gptData.choices[0].message.content

    // 5. Extraer imágenes CON VALIDACIÓN
    const images = documents
      .filter((doc: any) => {
        const hasImageUrl = doc.metadata?.imagen_url
        console.log('Doc has imagen_url:', hasImageUrl, doc.metadata?.nombre)
        return hasImageUrl
      })
      .map((doc: any) => {
        const meta = doc.metadata
        const lat = meta.latitude || meta.lat
        const lng = meta.longitude || meta.lng || meta.lon
        
        return {
          url: meta.imagen_url,
          nombre: meta.nombre,
          tipo: meta.type,
          map_url: lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : null,
          direccion: meta.direccion
        }
      })

    console.log('Images array length:', images.length)

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
    console.error('Error:', error)
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
