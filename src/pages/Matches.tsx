import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-br from-secondary to-accent text-primary-foreground py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Partidos</h1>
            </div>
            <p className="text-lg opacity-90">
              Calendario completo del Mundial 2026
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 bg-muted/50">
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
        <section className="py-16 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="text-center">
                <p className="text-muted-foreground">Cargando partidos...</p>
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay partidos programados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {filteredMatches.map((match) => (
                  <Card key={match.id} className="hover:shadow-lg transition-all hover:scale-[1.02] border-2 hover:border-accent">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs uppercase tracking-wide font-semibold text-primary">
                        {match.phase}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        {/* Home Team */}
                        <div className="flex flex-col items-center flex-1">
                          {match.home_team?.flag_url ? (
                            <img
                              src={match.home_team.flag_url}
                              alt={match.home_team.name}
                              className="w-12 h-12 object-cover rounded-full mb-2 border-2 border-muted"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-muted mb-2" />
                          )}
                          <p className="font-semibold text-sm text-center">
                            {match.home_team?.name || "TBD"}
                          </p>
                        </div>

                        {/* Score */}
                        <div className="text-center px-4">
                          {match.status === "completed" ? (
                            <div className="text-2xl font-bold">
                              {match.home_score} - {match.away_score}
                            </div>
                          ) : (
                            <div className="text-lg font-semibold text-muted-foreground">VS</div>
                          )}
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center flex-1">
                          {match.away_team?.flag_url ? (
                            <img
                              src={match.away_team.flag_url}
                              alt={match.away_team.name}
                              className="w-12 h-12 object-cover rounded-full mb-2 border-2 border-muted"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-muted mb-2" />
                          )}
                          <p className="font-semibold text-sm text-center">
                            {match.away_team?.name || "TBD"}
                          </p>
                        </div>
                      </div>

                      {/* Match Info */}
                      <div className="space-y-2 text-sm text-muted-foreground border-t pt-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(match.match_date), "PPP 'a las' p", { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{match.stadium}, {match.city}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Matches;
