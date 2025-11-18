import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/vnd.google-earth.kml+xml'
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const CORREDOR_ID = '8aad43fc-9854-40d3-a73b-2558f42d14ad'
    
    const [restaurantes, hoteles, imperdibles, estacionamientos, ecobici] = await Promise.all([
      supabase.from('restaurantes').select('*').eq('corredor_id', CORREDOR_ID).eq('activo', true).neq('latitud', 0).neq('longitud', 0),
      supabase.from('hoteles').select('*').eq('corredor_id', CORREDOR_ID).eq('activo', true).neq('latitud', 0).neq('longitud', 0),
      supabase.from('imperdibles_turisticos').select('*').eq('corredor_id', CORREDOR_ID).eq('activo', true).neq('latitud', 0).neq('longitud', 0),
      supabase.from('estacionamientos').select('*').eq('corredor_id', CORREDOR_ID).eq('activo', true).neq('latitud', 0).neq('longitud', 0),
      supabase.from('estaciones_ecobici').select('*').eq('corredor_id', CORREDOR_ID).eq('activa', true).neq('latitud', 0).neq('longitud', 0)
    ])

    const allPoints = [
      ...(restaurantes.data || []).map(r => ({ ...r, category: 'restaurante', icon: '🍽️' })),
      ...(hoteles.data || []).map(h => ({ ...h, category: 'hotel', icon: '🏨' })),
      ...(imperdibles.data || []).map(i => ({ ...i, category: 'imperdible', icon: '🎯' })),
      ...(estacionamientos.data || []).map(e => ({ ...e, category: 'estacionamiento', icon: '🅿️' })),
      ...(ecobici.data || []).map(e => ({ ...e, category: 'ecobici', icon: '🚲' }))
    ]

    const placemarks = allPoints.map((point: any) => {
      const lat = parseFloat(point.latitud)
      const lng = parseFloat(point.longitud)
      
      if (isNaN(lat) || isNaN(lng)) return ''

      let description = ''
      
      if (point.imagen_principal_url) {
        description += `<img src="${escapeXml(point.imagen_principal_url)}" width="300" style="border-radius: 8px; margin-bottom: 10px;"/><br/>`
      }
      
      description += `<b>${point.icon} ${escapeXml(point.category)}</b><br/>`
      
      if (point.descripcion_corta || point.descripcion) {
        description += `<p>${escapeXml(point.descripcion_corta || point.descripcion)}</p><br/>`
      }
      
      if (point.direccion) {
        description += `📍 ${escapeXml(point.direccion)}`
      }

      return `
    <Placemark>
      <name>${escapeXml(point.nombre)}</name>
      <description><![CDATA[${description}]]></description>
      <Point>
        <coordinates>${lng},${lat},0</coordinates>
      </Point>
    </Placemark>`
    }).filter(p => p !== '').join('\n')

    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Zona Rosa - CDMX</name>
    <description>Todos los puntos de interés del corredor Zona Rosa</description>
${placemarks}
  </Document>
</kml>`

    return new Response(kml, { headers: corsHeaders })

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Error</name>
    <description>Error: ${error instanceof Error ? error.message : "Unknown error"}</description>
  </Document>
</kml>`,
      { 
        status: 500,
        headers: corsHeaders 
      }
    )
  }
})
