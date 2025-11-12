#!/bin/bash

# Datos de corredores
declare -A corredores=(
  ["zona-rosa"]="8aad43fc-9854-40d3-a73b-2558f42d14ad"
  ["basilica"]="b1663b4b-466f-433f-9f8a-9ea2508ad032"
  ["coyoacan"]="97493529-0625-44c7-a514-0b41cf612903"
  ["garibaldi"]="762ff70a-2f15-4422-82ad-96d271b09bd2"
  ["xochimilco"]="bc2c91a3-b564-4962-b74d-e13b6b7cb1b3"
  ["centro-historico"]="1a607716-bad4-4982-ba13-99884c02a730"
  ["chapultepec"]="b90c50e9-027e-4394-ac13-57f29d4bc84f"
)

# Categorías
declare -A categorias=(
  ["restaurantes"]="restaurantes|🍽️|Restaurante"
  ["hoteles"]="hoteles|🏨|Hotel"
  ["imperdibles"]="imperdibles_turisticos|🎯|Imperdible"
  ["estacionamientos"]="estacionamientos|🅿️|Estacionamiento"
  ["ecobici"]="estaciones_ecobici|🚲|EcoBici"
)

for corredor in "${!corredores[@]}"; do
  corredor_id="${corredores[$corredor]}"
  corredor_nombre="${corredor//-/ }"
  corredor_nombre="${corredor_nombre^}"
  
  for categoria in "${!categorias[@]}"; do
    IFS='|' read -r tabla icon nombre_cat <<< "${categorias[$categoria]}"
    
    func_name="goodbarber-${corredor}-${categoria}-kml"
    mkdir -p "supabase/functions/${func_name}"
    
    # Determinar el campo de activo
    if [ "$categoria" = "ecobici" ]; then
      activo_field="activa"
    else
      activo_field="activo"
    fi
    
    cat > "supabase/functions/${func_name}/index.ts" << EOF
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': '*','Content-Type': 'application/vnd.google-earth.kml+xml'}
function escapeXml(unsafe: string): string {if (!unsafe) return ''; return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { auth: { persistSession: false } })
    const { data, error } = await supabase.from('${tabla}').select('*').eq('corredor_id', '${corredor_id}').eq('${activo_field}', true).neq('latitud', 0).neq('longitud', 0)
    if (error) throw error
    
    const placemarks = (data || []).map((point: any) => {
      const lat = parseFloat(point.latitud)
      const lng = parseFloat(point.longitud)
      if (isNaN(lat) || isNaN(lng)) return ''
      let description = ''
      if (point.imagen_principal_url) description += \`<img src="\${escapeXml(point.imagen_principal_url)}" width="300" style="border-radius: 8px; margin-bottom: 10px;"/><br/>\`
      description += \`<b>${icon} ${nombre_cat}</b><br/>\`
      if (point.descripcion_corta || point.descripcion) description += \`<p>\${escapeXml(point.descripcion_corta || point.descripcion)}</p><br/>\`
      if (point.direccion) description += \`📍 \${escapeXml(point.direccion)}\`
      return \`<Placemark><name>\${escapeXml(point.nombre)}</name><description><![CDATA[\${description}]]></description><Point><coordinates>\${lng},\${lat},0</coordinates></Point></Placemark>\`
    }).filter(p => p !== '').join('\\n')
    
    const kml = \`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${corredor_nombre} - ${nombre_cat}</name><description>${nombre_cat} del corredor ${corredor_nombre}</description>\${placemarks}</Document></kml>\`
    return new Response(kml, { headers: corsHeaders })
  } catch (error) {
    return new Response(\`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Error</name><description>Error: \${error.message}</description></Document></kml>\`, { status: 500, headers: corsHeaders })
  }
})
EOF
    
    echo "✅ ${func_name}"
  done
done

echo ""
echo "🎉 35 funciones creadas"
