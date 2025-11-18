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
    const { message } = await req.json()
    
    // Crear cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar documentos relevantes con múltiples estrategias
    let documents = []
    
    // Estrategia 1: Búsqueda por palabras clave
    const keywords = message.toLowerCase()
    let query = supabase
      .from('rag_documents')
      .select('content, metadata')
    
    if (keywords.includes('argentina') || keywords.includes('messi')) {
      query = query.eq('metadata->>country', 'ARG')
    } else if (keywords.includes('brasil') || keywords.includes('brazil')) {
      query = query.eq('metadata->>country', 'BRA')
    } else if (keywords.includes('méxico') || keywords.includes('mexico')) {
      query = query.eq('metadata->>country', 'MEX')
    } else if (keywords.includes('francia') || keywords.includes('france')) {
      query = query.eq('metadata->>country', 'FRA')
    } else if (keywords.includes('españa') || keywords.includes('spain')) {
      query = query.eq('metadata->>country', 'ESP')
    } else if (keywords.includes('qatar 2022') || keywords.includes('campeón') || keywords.includes('ganó')) {
      query = query.eq('metadata->>champion', true)
    } else if (keywords.includes('anfitrion') || keywords.includes('host') || keywords.includes('2026')) {
      query = query.or('metadata->>host.eq.true,metadata->>year.eq.2026')
    } else {
      // Búsqueda general por contenido
      query = query.textSearch('content', message, { type: 'websearch' })
    }

    const { data: searchResults, error } = await query.limit(5)
    
    if (error) {
      console.error('Error searching documents:', error)
    }

    documents = searchResults || []

    // Si no encontramos nada específico, buscar todos los documentos
    if (documents.length === 0) {
      const { data: allDocs } = await supabase
        .from('rag_documents')
        .select('content, metadata')
        .limit(3)
      documents = allDocs || []
    }

    // Crear contexto para la IA
    let context = "Información disponible sobre el Mundial de Fútbol:\n"
    if (documents.length > 0) {
      context += documents.map(doc => `- ${doc.content}`).join('\n')
    } else {
      context += "- No se encontró información específica en la base de datos."
    }

    // Llamar a OpenAI con el contexto
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Eres Jalapeño 🌶️, un asistente experto del Mundial de Fútbol 2026. 
            Responde en español de forma amigable y concisa usando SOLO la información proporcionada.
            Si la información está disponible, úsala exactamente como se proporciona.
            Si no tienes información específica, di que no la tienes pero ofrece ayuda general.
            
            ${context}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    })

    const aiData = await openaiResponse.json()
    const response = aiData.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu pregunta.'

    return new Response(
      JSON.stringify({ 
        response,
        debug: {
          documentsFound: documents.length,
          searchQuery: message
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        response: 'Lo siento, hubo un error. Intenta de nuevo.' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})
