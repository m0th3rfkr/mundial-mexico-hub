#!/bin/bash

# IDs de los corredores
declare -A CORREDOR_IDS=(
    ["basilica"]="b1663b4b-466f-433f-9f8a-9ea2508ad032"
    ["centro-historico"]="1a607716-bad4-4982-ba13-99884c02a730"
    ["chapultepec"]="b90c50e9-027e-4394-ac13-57f29d4bc84f"
    ["coyoacan"]="97493529-0625-44c7-a514-0b41cf612903"
    ["garibaldi"]="762ff70a-2f15-4422-82ad-96d271b09bd2"
    ["xochimilco"]="bc2c91a3-b564-4962-b74d-e13b6b7cb1b3"
)

# Nombres bonitos de los corredores
declare -A CORREDOR_NAMES=(
    ["basilica"]="Basílica"
    ["centro-historico"]="Centro Histórico"
    ["chapultepec"]="Chapultepec"
    ["coyoacan"]="Coyoacán"
    ["garibaldi"]="Garibaldi"
    ["xochimilco"]="Xochimilco"
)

# Crear funciones para cada corredor y categoría
for corredor in basilica centro-historico chapultepec coyoacan garibaldi xochimilco; do
    corredor_id="${CORREDOR_IDS[$corredor]}"
    corredor_name="${CORREDOR_NAMES[$corredor]}"
    
    # RESTAURANTES
    mkdir -p "goodbarber-${corredor}-restaurantes-kml"
    cat > "goodbarber-${corredor}-restaurantes-kml/index.ts" << EOF
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': '*','Content-Type': 'application/vnd.google-earth.kml+xml'}
function escapeXml(u: string): string {if (!u) return ''; return u.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
serve(async (req: Request) => {if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders }); try {const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { auth: { persistSession: false } }); const { data, error } = await supabase.from('restaurantes').select('*').eq('corredor_id', '${corredor_id}').eq('activo', true).neq('latitud', 0).neq('longitud', 0); if (error) throw error; const placemarks = (data || []).map((p: any) => {const lat = parseFloat(p.latitud); const lng = parseFloat(p.longitud); if (isNaN(lat) || isNaN(lng)) return ''; let d = ''; if (p.imagen_principal_url) d += \`<img src="\${escapeXml(p.imagen_principal_url)}" width="300"/><br/>\`; d += \`<b>🍽️ Restaurante</b><br/>\`; if (p.descripcion_corta) d += \`<p>\${escapeXml(p.descripcion_corta)}</p><br/>\`; if (p.direccion) d += \`📍 \${escapeXml(p.direccion)}\`; return \`<Placemark><name>\${escapeXml(p.nombre)}</name><description><![CDATA[\${d}]]></description><Point><coordinates>\${lng},\${lat},0</coordinates></Point></Placemark>\`}).filter(x => x !== '').join('\\n'); const kml = \`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${corredor_name} - Restaurantes</name>\${placemarks}</Document></kml>\`; return new Response(kml, { headers: corsHeaders })} catch (error) {return new Response(\`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Error</name><description>\${error.message}</description></Document></kml>\`, { status: 500, headers: corsHeaders })}})
EOF
    echo "✓ Creado: goodbarber-${corredor}-restaurantes-kml"
    
    # HOTELES
    mkdir -p "goodbarber-${corredor}-hoteles-kml"
    cat > "goodbarber-${corredor}-hoteles-kml/index.ts" << EOF
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': '*','Content-Type': 'application/vnd.google-earth.kml+xml'}
function escapeXml(u: string): string {if (!u) return ''; return u.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
serve(async (req: Request) => {if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders }); try {const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { auth: { persistSession: false } }); const { data, error } = await supabase.from('hoteles').select('*').eq('corredor_id', '${corredor_id}').eq('activo', true).neq('latitud', 0).neq('longitud', 0); if (error) throw error; const placemarks = (data || []).map((p: any) => {const lat = parseFloat(p.latitud); const lng = parseFloat(p.longitud); if (isNaN(lat) || isNaN(lng)) return ''; let d = ''; if (p.imagen_principal_url) d += \`<img src="\${escapeXml(p.imagen_principal_url)}" width="300"/><br/>\`; d += \`<b>🏨 Hotel</b><br/>\`; if (p.descripcion_corta) d += \`<p>\${escapeXml(p.descripcion_corta)}</p><br/>\`; if (p.direccion) d += \`📍 \${escapeXml(p.direccion)}\`; return \`<Placemark><name>\${escapeXml(p.nombre)}</name><description><![CDATA[\${d}]]></description><Point><coordinates>\${lng},\${lat},0</coordinates></Point></Placemark>\`}).filter(x => x !== '').join('\\n'); const kml = \`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${corredor_name} - Hoteles</name>\${placemarks}</Document></kml>\`; return new Response(kml, { headers: corsHeaders })} catch (error) {return new Response(\`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Error</name><description>\${error.message}</description></Document></kml>\`, { status: 500, headers: corsHeaders })}})
EOF
    echo "✓ Creado: goodbarber-${corredor}-hoteles-kml"
    
    # IMPERDIBLES
    mkdir -p "goodbarber-${corredor}-imperdibles-kml"
    cat > "goodbarber-${corredor}-imperdibles-kml/index.ts" << EOF
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': '*','Content-Type': 'application/vnd.google-earth.kml+xml'}
function escapeXml(u: string): string {if (!u) return ''; return u.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
serve(async (req: Request) => {if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders }); try {const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { auth: { persistSession: false } }); const { data, error } = await supabase.from('imperdibles').select('*').eq('corredor_id', '${corredor_id}').eq('activo', true).neq('latitud', 0).neq('longitud', 0); if (error) throw error; const placemarks = (data || []).map((p: any) => {const lat = parseFloat(p.latitud); const lng = parseFloat(p.longitud); if (isNaN(lat) || isNaN(lng)) return ''; let d = ''; if (p.imagen_principal_url) d += \`<img src="\${escapeXml(p.imagen_principal_url)}" width="300"/><br/>\`; d += \`<b>📍 Imperdible</b><br/>\`; if (p.descripcion_corta) d += \`<p>\${escapeXml(p.descripcion_corta)}</p><br/>\`; if (p.direccion) d += \`📍 \${escapeXml(p.direccion)}\`; return \`<Placemark><name>\${escapeXml(p.nombre)}</name><description><![CDATA[\${d}]]></description><Point><coordinates>\${lng},\${lat},0</coordinates></Point></Placemark>\`}).filter(x => x !== '').join('\\n'); const kml = \`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${corredor_name} - Imperdibles</name>\${placemarks}</Document></kml>\`; return new Response(kml, { headers: corsHeaders })} catch (error) {return new Response(\`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Error</name><description>\${error.message}</description></Document></kml>\`, { status: 500, headers: corsHeaders })}})
EOF
    echo "✓ Creado: goodbarber-${corredor}-imperdibles-kml"
    
    # ESTACIONAMIENTOS
    mkdir -p "goodbarber-${corredor}-estacionamientos-kml"
    cat > "goodbarber-${corredor}-estacionamientos-kml/index.ts" << EOF
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': '*','Content-Type': 'application/vnd.google-earth.kml+xml'}
function escapeXml(u: string): string {if (!u) return ''; return u.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
serve(async (req: Request) => {if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders }); try {const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { auth: { persistSession: false } }); const { data, error } = await supabase.from('estacionamientos').select('*').eq('corredor_id', '${corredor_id}').neq('latitud', 0).neq('longitud', 0); if (error) throw error; const placemarks = (data || []).map((p: any) => {const lat = parseFloat(p.latitud); const lng = parseFloat(p.longitud); if (isNaN(lat) || isNaN(lng)) return ''; let d = ''; if (p.imagen_url) d += \`<img src="\${escapeXml(p.imagen_url)}" width="300"/><br/>\`; d += \`<b>🅿️ Estacionamiento</b><br/>\`; if (p.descripcion) d += \`<p>\${escapeXml(p.descripcion)}</p><br/>\`; if (p.direccion) d += \`📍 \${escapeXml(p.direccion)}\`; return \`<Placemark><name>\${escapeXml(p.nombre)}</name><description><![CDATA[\${d}]]></description><Point><coordinates>\${lng},\${lat},0</coordinates></Point></Placemark>\`}).filter(x => x !== '').join('\\n'); const kml = \`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${corredor_name} - Estacionamientos</name>\${placemarks}</Document></kml>\`; return new Response(kml, { headers: corsHeaders })} catch (error) {return new Response(\`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Error</name><description>\${error.message}</description></Document></kml>\`, { status: 500, headers: corsHeaders })}})
EOF
    echo "✓ Creado: goodbarber-${corredor}-estacionamientos-kml"
    
    # ECOBICI
    mkdir -p "goodbarber-${corredor}-ecobici-kml"
    cat > "goodbarber-${corredor}-ecobici-kml/index.ts" << EOF
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': '*','Content-Type': 'application/vnd.google-earth.kml+xml'}
function escapeXml(u: string): string {if (!u) return ''; return u.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
serve(async (req: Request) => {if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders }); try {const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { auth: { persistSession: false } }); const { data, error } = await supabase.from('estaciones_ecobici').select('*').eq('corredor_id', '${corredor_id}').neq('latitud', 0).neq('longitud', 0); if (error) throw error; const placemarks = (data || []).map((p: any) => {const lat = parseFloat(p.latitud); const lng = parseFloat(p.longitud); if (isNaN(lat) || isNaN(lng)) return ''; let d = ''; d += \`<b>🚲 Estación Ecobici</b><br/>\`; if (p.capacidad) d += \`<p>Capacidad: \${p.capacidad} bicicletas</p><br/>\`; if (p.direccion) d += \`📍 \${escapeXml(p.direccion)}\`; return \`<Placemark><name>\${escapeXml(p.nombre)}</name><description><![CDATA[\${d}]]></description><Point><coordinates>\${lng},\${lat},0</coordinates></Point></Placemark>\`}).filter(x => x !== '').join('\\n'); const kml = \`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${corredor_name} - Ecobici</name>\${placemarks}</Document></kml>\`; return new Response(kml, { headers: corsHeaders })} catch (error) {return new Response(\`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Error</name><description>\${error.message}</description></Document></kml>\`, { status: 500, headers: corsHeaders })}})
EOF
    echo "✓ Creado: goodbarber-${corredor}-ecobici-kml"
    
done

echo ""
echo "✅ ¡30 funciones creadas exitosamente!"
echo ""
echo "Ahora despliega con:"
echo "  bash deploy_all_functions.sh"
