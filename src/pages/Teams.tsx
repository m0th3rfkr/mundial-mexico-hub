import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Team = Tables<"teams">;

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [selectedConfederation, setSelectedConfederation] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [teams, selectedConfederation, selectedGroup]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTeams = () => {
    let filtered = teams;

    if (selectedConfederation !== "all") {
      filtered = filtered.filter((team) => team.confederation === selectedConfederation);
    }

    if (selectedGroup !== "all") {
      filtered = filtered.filter((team) => team.group_letter === selectedGroup);
    }

    setFilteredTeams(filtered);
  };

  const confederations = [...new Set(teams.map((team) => team.confederation).filter(Boolean))];
  const groups = [...new Set(teams.map((team) => team.group_letter).filter(Boolean))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Equipos</h1>
            </div>
            <p className="text-lg opacity-90">
              Conoce a todas las selecciones participantes del Mundial 2026
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Select value={selectedConfederation} onValueChange={setSelectedConfederation}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filtrar por confederación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las confederaciones</SelectItem>
                  {confederations.map((conf) => (
                    <SelectItem key={conf} value={conf!}>
                      {conf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filtrar por grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grupos</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group!}>
                      Grupo {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedConfederation !== "all" || selectedGroup !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedConfederation("all");
                    setSelectedGroup("all");
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Teams Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="text-center">
                <p className="text-muted-foreground">Cargando equipos...</p>
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No se encontraron equipos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTeams.map((team) => (
                  <Card
                    key={team.id}
                    className="group hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary cursor-pointer"
                  >
                    <CardHeader className="text-center">
                      {team.flag_url ? (
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-muted group-hover:border-accent transition-colors">
                          <img
                            src={team.flag_url}
                            alt={`Bandera de ${team.name}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-4 border-muted group-hover:border-accent transition-colors">
                          <Shield className="h-12 w-12 text-primary" />
                        </div>
                      )}
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {team.name}
                      </CardTitle>
                      <CardDescription>
                        {team.code} {team.group_letter && `• Grupo ${team.group_letter}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground">
                      {team.confederation && <p className="mb-1">{team.confederation}</p>}
                      {team.coach_name && <p>DT: {team.coach_name}</p>}
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

export default Teams;
