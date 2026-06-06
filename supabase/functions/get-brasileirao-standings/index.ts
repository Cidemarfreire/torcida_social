import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('FOOTBALL_DATA_API_KEY')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'FOOTBALL_DATA_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch('https://api.football-data.org/v4/competitions/BSA/standings', {
      headers: {
        'X-Auth-Token': apiKey,
      },
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch standings from football-data.org' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    
    // Extract and clean the standings data
    const standings = data.standings[0].table.map((team: any) => ({
      position: team.position,
      teamName: team.team.name,
      playedGames: team.playedGames,
      won: team.won,
      draw: team.draw,
      lost: team.lost,
      points: team.points,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalDifference,
    }))

    return new Response(
      JSON.stringify({ standings }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
