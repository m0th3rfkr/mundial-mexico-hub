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
    const { query, table, limit = 10, similarity_threshold = 0.7 } = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    let results = []

    // Query different tables based on the query content
    if (!table || table === 'teams') {
      const { data: teams } = await supabaseClient
        .from('teams')
        .select('*')
        .or(`name.ilike.%${query}%,code.ilike.%${query}%,confederation.ilike.%${query}%`)
        .limit(limit)

      if (teams) {
        results.push(...teams.map(team => ({
          type: 'team',
          data: team,
          relevance: calculateRelevance(query, [team.name, team.code, team.confederation])
        })))
      }
    }

    if (!table || table === 'players') {
      const { data: players } = await supabaseClient
        .from('players')
        .select(`
          *,
          teams:team_id (
            name,
            code,
            flag_url
          )
        `)
        .or(`name.ilike.%${query}%,position.ilike.%${query}%,club.ilike.%${query}%`)
        .limit(limit)

      if (players) {
        results.push(...players.map(player => ({
          type: 'player',
          data: player,
          relevance: calculateRelevance(query, [player.name, player.position, player.club])
        })))
      }
    }

    if (!table || table === 'matches') {
      const { data: matches } = await supabaseClient
        .from('matches')
        .select(`
          *,
          home_team:home_team_id (name, code, flag_url),
          away_team:away_team_id (name, code, flag_url),
          venue:venue_id (name, city, country)
        `)
        .limit(limit)

      if (matches) {
        results.push(...matches.map(match => ({
          type: 'match',
          data: match,
          relevance: calculateRelevance(query, [
            match.home_team?.name || '',
            match.away_team?.name || '',
            match.venue?.name || ''
          ])
        })))
      }
    }

    if (!table || table === 'articles') {
      const { data: articles } = await supabaseClient
        .from('articles')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.ilike.%${query}%`)
        .limit(limit)

      if (articles) {
        results.push(...articles.map(article => ({
          type: 'article',
          data: article,
          relevance: calculateRelevance(query, [article.title, article.content, article.tags])
        })))
      }
    }

    // Sort by relevance and apply similarity threshold
    results = results
      .filter(result => result.relevance >= similarity_threshold)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)

    return new Response(
      JSON.stringify({
        query,
        results,
        total: results.length,
        similarity_threshold
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function calculateRelevance(query: string, fields: string[]): number {
  const queryLower = query.toLowerCase()
  let maxRelevance = 0

  for (const field of fields) {
    if (!field) continue
    
    const fieldLower = field.toLowerCase()
    
    // Exact match
    if (fieldLower === queryLower) {
      return 1.0
    }
    
    // Contains query
    if (fieldLower.includes(queryLower)) {
      const relevance = queryLower.length / fieldLower.length
      maxRelevance = Math.max(maxRelevance, relevance)
    }
    
    // Word match
    const queryWords = queryLower.split(' ')
    const fieldWords = fieldLower.split(' ')
    const matchingWords = queryWords.filter(word => 
      fieldWords.some(fieldWord => fieldWord.includes(word))
    )
    
    if (matchingWords.length > 0) {
      const wordRelevance = matchingWords.length / queryWords.length * 0.8
      maxRelevance = Math.max(maxRelevance, wordRelevance)
    }
  }

  return maxRelevance
}
