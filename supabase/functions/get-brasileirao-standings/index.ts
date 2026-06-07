import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  console.log("get-brasileirao-standings: Request received");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("FOOTBALL_DATA_API_KEY");

    if (!apiKey) {
      console.error("FOOTBALL_DATA_API_KEY not configured");

      return new Response(
        JSON.stringify({
          error: "FOOTBALL_DATA_API_KEY not configured",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const response = await fetch(
      "https://api.football-data.org/v4/competitions/BSA/standings",
      {
        method: "GET",
        headers: {
          "X-Auth-Token": apiKey,
        },
      },
    );

    console.log("football-data.org response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      console.error("football-data.org error:", errorText);

      return new Response(
        JSON.stringify({
          error: "Failed to fetch standings from football-data.org",
          status: response.status,
          details: errorText,
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const data = await response.json();
    const table = data?.standings?.[0]?.table ?? [];

    const standings = table.map((team: any) => ({
      position: team.position,
      teamName: team.team?.name ?? "",
      playedGames: team.playedGames,
      won: team.won,
      draw: team.draw,
      lost: team.lost,
      points: team.points,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalDifference,
    }));

    return new Response(
      JSON.stringify({
        standings,
        updatedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("get-brasileirao-standings error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unexpected error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});