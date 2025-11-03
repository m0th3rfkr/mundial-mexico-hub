import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const GOOGLE_API_KEY = 'AIzaSyDgL9w1oje-nl0O5YMqlCz1QLSBQZLlmfg';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TourismItem {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  imagen_principal_url: string | null;
}

interface PlacesSearchResult {
  places: Array<{
    id: string;
    displayName: { text: string };
    photos?: Array<{
      name: string;
      widthPx: number;
      heightPx: number;
    }>;
  }>;
}

type CategoryType = 'restaurantes' | 'hoteles' | 'imperdibles_turisticos';

const CATEGORY_CONFIG = {
  restaurantes: {
    table: 'restaurantes',
    searchSuffix: 'restaurante CDMX Mexico',
    folder: 'restaurantes'
  },
  hoteles: {
    table: 'hoteles',
    searchSuffix: 'hotel CDMX Mexico',
    folder: 'hoteles'
  },
  imperdibles_turisticos: {
    table: 'imperdibles_turisticos',
    searchSuffix: 'CDMX Mexico',
    folder: 'imperdibles'
  }
};

async function searchInGooglePlaces(nombre: string, direccion: string, category: CategoryType): Promise<string | null> {
  try {
    const config = CATEGORY_CONFIG[category];
    const searchQuery = `${nombre} ${direccion} ${config.searchSuffix}`;
    
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.photos'
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        maxResultCount: 1
      })
    });

    if (!response.ok) {
      console.error(`Error searching for ${nombre}: ${response.statusText}`);
      return null;
    }

    const data: PlacesSearchResult = await response.json();
    
    if (!data.places || data.places.length === 0 || !data.places[0].photos || data.places[0].photos.length === 0) {
      console.log(`No photos found for ${nombre}`);
      return null;
    }

    return data.places[0].photos[0].name;
  } catch (error) {
    console.error(`Error searching ${nombre}:`, error);
    return null;
  }
}

async function downloadPhotoFromGooglePlaces(photoName: string, maxWidth: number = 1200): Promise<Uint8Array | null> {
  try {
    const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(photoUrl);
    
    if (!response.ok) {
      console.error(`Error downloading photo: ${response.statusText}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error downloading photo:', error);
    return null;
  }
}

async function uploadToSupabaseStorage(
  supabase: any,
  imageData: Uint8Array,
  itemId: string,
  itemName: string,
  category: CategoryType
): Promise<string | null> {
  try {
    const config = CATEGORY_CONFIG[category];
    const cleanName = itemName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const fileName = `${config.folder}/${itemId}/${cleanName}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('tourism-images')
      .upload(fileName, imageData, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`Error uploading to storage:`, error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('tourism-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase Storage:', error);
    return null;
  }
}

async function updateItemImage(supabase: any, itemId: string, imageUrl: string, category: CategoryType): Promise<boolean> {
  try {
    const config = CATEGORY_CONFIG[category];
    const { error } = await supabase
      .from(config.table)
      .update({ imagen_principal_url: imageUrl })
      .eq('id', itemId);

    if (error) {
      console.error(`Error updating item ${itemId}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating item:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const categoryParam = url.searchParams.get('category') as CategoryType;
    
    if (!categoryParam || !CATEGORY_CONFIG[categoryParam]) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid category. Use: restaurantes, hoteles, or imperdibles_turisticos' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const category = categoryParam;
    const config = CATEGORY_CONFIG[category];
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: items, error: fetchError } = await supabase
      .from(config.table)
      .select('id, nombre, direccion, latitud, longitud, imagen_principal_url')
      .neq('latitud', 0)
      .neq('longitud', 0)
      .order('nombre');

    if (fetchError) {
      throw new Error(`Error fetching ${category}: ${fetchError.message}`);
    }

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `No ${category} found`,
          category,
          processed: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    const results = {
      category,
      total: items.length,
      processed: 0,
      success: 0,
      failed: 0,
      skipped: 0,
      details: [] as any[]
    };

    for (const item of items as TourismItem[]) {
      results.processed++;
      
      if (item.imagen_principal_url) {
        results.skipped++;
        console.log(`Skipping ${item.nombre} - already has image`);
        continue;
      }

      console.log(`Processing ${results.processed}/${results.total}: ${item.nombre}`);

      const photoName = await searchInGooglePlaces(item.nombre, item.direccion, category);
      
      if (!photoName) {
        results.failed++;
        results.details.push({
          id: item.id,
          nombre: item.nombre,
          status: 'failed',
          reason: 'No photo found in Google Places'
        });
        continue;
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      const imageData = await downloadPhotoFromGooglePlaces(photoName);
      
      if (!imageData) {
        results.failed++;
        results.details.push({
          id: item.id,
          nombre: item.nombre,
          status: 'failed',
          reason: 'Failed to download photo'
        });
        continue;
      }

      const publicUrl = await uploadToSupabaseStorage(
        supabase,
        imageData,
        item.id,
        item.nombre,
        category
      );

      if (!publicUrl) {
        results.failed++;
        results.details.push({
          id: item.id,
          nombre: item.nombre,
          status: 'failed',
          reason: 'Failed to upload to storage'
        });
        continue;
      }

      const updated = await updateItemImage(supabase, item.id, publicUrl, category);

      if (updated) {
        results.success++;
        results.details.push({
          id: item.id,
          nombre: item.nombre,
          status: 'success',
          imageUrl: publicUrl
        });
        console.log(`✅ Success: ${item.nombre}`);
      } else {
        results.failed++;
        results.details.push({
          id: item.id,
          nombre: item.nombre,
          status: 'failed',
          reason: 'Failed to update database'
        });
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.processed} ${category}`,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
