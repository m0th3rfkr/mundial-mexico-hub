import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import MatchCard from "@/components/cards/MatchCard";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Match = Tables<"matches"> & {
  home_team: Tables<"teams"> | null;
  away_team: Tables<"teams"> | null;
};

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    filterMatches();
  }, [matches, selectedPhase]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(*),
          away_team:teams!matches_away_team_id_fkey(*)
        `)
        .order("match_date");

      if (error) throw error;
      setMatches(data as Match[] || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMatches = () => {
    if (selectedPhase === "all") {
      setFilteredMatches(matches);
    } else {
      setFilteredMatches(matches.filter((match) => match.phase === selectedPhase));
    }
  };

  const phases = [...new Set(matches.map((match) => match.phase))];

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <main className="flex-1">
        {/* Filters */}
        <section className="py-4 px-4 pt-6 bg-background">
          <div className="container mx-auto">
            <div className="flex justify-center">
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filtrar por fase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fases</SelectItem>
                  {phases.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Matches List */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando partidos...</p>
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay partidos programados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    homeTeam={{
                      name: match.home_team?.name || "TBD",
                      flag_url: match.home_team?.flag_url,
                      code: match.home_team?.code || "TBD",
                    }}
                    awayTeam={{
                      name: match.away_team?.name || "TBD",
                      flag_url: match.away_team?.flag_url,
                      code: match.away_team?.code || "TBD",
                    }}
                    matchDate={match.match_date}
                    stadium={match.stadium}
                    city={match.city}
                    phase={match.phase}
                    status={match.status || "scheduled"}
                    homeScore={match.home_score || undefined}
                    awayScore={match.away_score || undefined}
                    isLive={match.status === "live"}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Matches;
