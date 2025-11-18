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
      .from('hoteles')
      .select('id, nombre, tipo_alojamiento, descripcion, descripcion_corta, direccion, telefono, sitio_web, latitud, longitud, imagen_principal_url, rango_precios, categoria_estrellas')
      .neq('latitud', 0)
      .neq('longitud', 0)
      .eq('activo', true)
      .order('nombre', { ascending: true })

    if (error) throw error

    const placemarks = (data || []).map((h: any) => {
      const lat = parseFloat(h.latitud)
      const lng = parseFloat(h.longitud)
      
      if (isNaN(lat) || isNaN(lng)) return ''

      let description = ''
      
      if (h.imagen_principal_url) {
        description += `<img src="${escapeXml(h.imagen_principal_url)}" width="300" style="border-radius: 8px; margin-bottom: 10px;"/><br/>`
      }
      
      if (h.tipo_alojamiento) {
        description += `<b>🏨 ${escapeXml(h.tipo_alojamiento)}</b><br/>`
      }
      
      if (h.categoria_estrellas) {
        description += `⭐ ${h.categoria_estrellas} estrellas<br/>`
      }
      
      if (h.rango_precios) {
        description += `💰 ${escapeXml(h.rango_precios)}<br/>`
      }
      
      if (h.descripcion_corta || h.descripcion) {
        description += `<p>${escapeXml(h.descripcion_corta || h.descripcion)}</p>`
      }
      
      if (h.direccion) {
        description += `<br/>📍 ${escapeXml(h.direccion)}`
      }
      
      if (h.telefono) {
        description += `<br/>📞 ${escapeXml(h.telefono)}`
      }
      
      if (h.sitio_web) {
        description += `<br/>🌐 <a href="${escapeXml(h.sitio_web)}" target="_blank">Sitio Web</a>`
      }

      return `
    <Placemark>
      <name>${escapeXml(h.nombre || 'Hotel')}</name>
      <description><![CDATA[${description}]]></description>
      <Point>
        <coordinates>${lng},${lat},0</coordinates>
      </Point>
    </Placemark>`
    }).filter(p => p !== '').join('\n')

    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Hoteles CDMX - Mundial 2026</name>
    <description>Hoteles en corredores turísticos de Ciudad de México</description>
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
