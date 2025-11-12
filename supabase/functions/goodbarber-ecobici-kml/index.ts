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

    const { data, error } = await supabase
      .from('estaciones_ecobici')
      .select('id, nombre, numero_estacion, descripcion, referencias, direccion, latitud, longitud, imagen_principal_url, capacidad_total, bicicletas_disponibles')
      .neq('latitud', 0)
      .neq('longitud', 0)
      .eq('activa', true)
      .order('nombre', { ascending: true })

    if (error) throw error

    const placemarks = (data || []).map((e: any) => {
      const lat = parseFloat(e.latitud)
      const lng = parseFloat(e.longitud)
      
      if (isNaN(lat) || isNaN(lng)) return ''

      let description = ''
      
      if (e.imagen_principal_url) {
        description += `<img src="${escapeXml(e.imagen_principal_url)}" width="300" style="border-radius: 8px; margin-bottom: 10px;"/><br/>`
      }
      
      description += `<b>🚲 Estación EcoBici</b><br/>`
      
      if (e.numero_estacion) {
        description += `#️⃣ Estación: ${escapeXml(e.numero_estacion)}<br/>`
      }
      
      if (e.bicicletas_disponibles) {
        description += `✅ Disponibles: ${e.bicicletas_disponibles}<br/>`
      }
      
      if (e.capacidad_total) {
        description += `📊 Capacidad: ${e.capacidad_total}<br/>`
      }
      
      if (e.referencias) {
        description += `<p>${escapeXml(e.referencias)}</p><br/>`
      }
      
      if (e.direccion) {
        description += `📍 ${escapeXml(e.direccion)}`
      }

      return `
    <Placemark>
      <name>${escapeXml(e.nombre)}</name>
      <description><![CDATA[${description}]]></description>
      <Point>
        <coordinates>${lng},${lat},0</coordinates>
      </Point>
    </Placemark>`
    }).filter(p => p !== '').join('\n')

    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>EcoBici CDMX - Mundial 2026</name>
    <description>Estaciones EcoBici en Ciudad de México</description>
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
    <description>Error: ${error.message}</description>
  </Document>
</kml>`,
      { 
        status: 500,
        headers: corsHeaders 
      }
    )
  }
})
