import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Star, Calendar as CalendarIcon } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

type Match = Tables<"matches"> & {
  home_team: Tables<"teams"> | null;
  away_team: Tables<"teams"> | null;
};

// Agrupar partidos por torneo/fase
interface MatchGroup {
  tournament: string;
  phase: string;
  matches: Match[];
}

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

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

  // Contar partidos en vivo
  const liveMatchesCount = matches.filter(m => m.status === "live").length;

  // Agrupar partidos por torneo y fase
  const groupedMatches: MatchGroup[] = matches.reduce((acc: MatchGroup[], match) => {
    const tournament = "CONMEBOL Libertadores 2025"; // Temporal - esto debería venir de la DB
    const existing = acc.find(g => g.tournament === tournament && g.phase === match.phase);
    
    if (existing) {
      existing.matches.push(match);
    } else {
      acc.push({
        tournament,
        phase: match.phase,
        matches: [match]
      });
    }
    
    return acc;
  }, []);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 bg-gray-50">
      {/* Header - MATCH CENTER */}
      <header className="bg-[#0066b2] text-white py-4 px-4 sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">MATCH CENTER</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Explorar partidos + VIVO AHORA */}
        <section className="bg-white py-4 px-4 border-b">
          <div className="container mx-auto flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Explorar partidos</h2>
            
            {liveMatchesCount > 0 && (
              <button className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-full px-4 py-2 hover:border-red-500 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-sm font-semibold text-gray-900">VIVO AHORA</span>
                <span className="bg-gray-100 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  {liveMatchesCount}
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Date Selector */}
        <section className="bg-white py-4 px-4 border-b sticky top-[60px] z-30">
          <div className="container mx-auto flex items-center justify-center gap-4">
            <button 
              onClick={handlePreviousDay}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-[#0066b2]" />
            </button>
            
            <div className="flex items-center gap-2 min-w-[240px] justify-center">
              <CalendarIcon className="h-5 w-5 text-[#0066b2]" />
              <span className="text-[#0066b2] font-semibold">
                Hoy, {format(selectedDate, "d MMM yyyy", { locale: es })}
              </span>
            </div>
            
            <button 
              onClick={handleNextDay}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-[#0066b2]" />
            </button>
          </div>
        </section>

        {/* Matches List */}
        <section className="py-4 px-4">
          <div className="container mx-auto max-w-2xl">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Cargando partidos...</p>
              </div>
            ) : groupedMatches.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No hay partidos programados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groupedMatches.map((group, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Tournament Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <div>
                        <h3 className="font-bold text-gray-900">{group.tournament}</h3>
                        <p className="text-sm text-gray-500">{group.phase}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                        <Star className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Matches in this group */}
                    <div className="divide-y">
                      {group.matches.map((match) => (
                        <div key={match.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                          {/* Stadium/Location */}
                          <p className="text-xs text-gray-500 mb-3">
                            {match.stadium} ({match.city})
                          </p>

                          {/* Match Details */}
                          <div className="flex items-center justify-between">
                            {/* Home Team */}
                            <div className="flex items-center gap-3 flex-1">
                              {match.home_team?.flag_url ? (
                                <img
                                  src={match.home_team.flag_url}
                                  alt={match.home_team.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs font-bold text-gray-600">
                                    {match.home_team?.code || "TBD"}
                                  </span>
                                </div>
                              )}
                              <span className="font-semibold text-gray-900">
                                {match.home_team?.name || "TBD"}
                              </span>
                            </div>

                            {/* Time or Score */}
                            <div className="px-4 text-right min-w-[80px]">
                              {match.status === "live" ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-xs text-red-500 font-bold">EN VIVO</span>
                                  <div className="flex items-center gap-2 text-lg font-bold">
                                    <span>{match.home_score || 0}</span>
                                    <span className="text-gray-400">-</span>
                                    <span>{match.away_score || 0}</span>
                                  </div>
                                </div>
                              ) : match.status === "completed" ? (
                                <div className="flex items-center gap-2 text-lg font-bold">
                                  <span>{match.home_score || 0}</span>
                                  <span className="text-gray-400">-</span>
                                  <span>{match.away_score || 0}</span>
                                </div>
                              ) : (
                                <span className="text-lg font-bold text-gray-900">
                                  {format(new Date(match.match_date), "HH:mm")}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Away Team */}
                          <div className="flex items-center gap-3 mt-3">
                            {match.away_team?.flag_url ? (
                              <img
                                src={match.away_team.flag_url}
                                alt={match.away_team.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600">
                                  {match.away_team?.code || "TBD"}
                                </span>
                              </div>
                            )}
                            <span className="font-semibold text-gray-900">
                              {match.away_team?.name || "TBD"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Ver tabla button */}
                    <div className="px-4 py-3 border-t bg-gray-50">
                      <button className="text-[#0066b2] font-semibold text-sm hover:underline">
                        Ver tabla
                      </button>
                    </div>
                  </div>
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
