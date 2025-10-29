import { useState, useEffect } from "react";
import { MapPin, Calendar, Newspaper, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Countdown from "@/components/Countdown";
import MatchCard from "@/components/cards/MatchCard";
import EventCard from "@/components/cards/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Index = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [events] = useState([
    {
      id: "1",
      title: "Fan Fest CDMX",
      date: "2026-06-15",
      time: "16:00",
      location: "Zócalo, Ciudad de México",
      imageUrl: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800",
      category: "Fan Zone"
    },
    {
      id: "2",
      title: "Concierto Inaugural",
      date: "2026-06-10",
      time: "20:00",
      location: "Estadio Azteca",
      imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      category: "Concierto"
    },
    {
      id: "3",
      title: "Festival Gastronómico",
      date: "2026-06-12",
      time: "12:00",
      location: "Reforma, CDMX",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      category: "Gastronomía"
    }
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load tourist routes - using teams as placeholder for now
      const { data: routesData } = await supabase
        .from("teams")
        .select("id, name, code, flag_url")
        .limit(4);
      if (routesData) setRoutes(routesData.map(t => ({ 
        id: t.id, 
        nombre: t.name, 
        descripcion: `Equipo nacional de ${t.name}` 
      })));

      // Load featured matches with teams
      const { data: matchesData } = await supabase
        .from("matches")
        .select(`
          id,
          match_date,
          stadium,
          city,
          phase,
          status,
          home_score,
          away_score,
          home_team_id,
          away_team_id
        `)
        .order("match_date", { ascending: true })
        .limit(3);

      if (matchesData) {
        // Load teams separately
        const teamIds = matchesData.flatMap(m => [m.home_team_id, m.away_team_id]).filter(Boolean);
        const { data: teamsData } = await supabase
          .from("teams")
          .select("id, name, code, flag_url")
          .in("id", teamIds as string[]);

        // Combine data
        const matchesWithTeams = matchesData.map(match => ({
          ...match,
          home_team: teamsData?.find(t => t.id === match.home_team_id),
          away_team: teamsData?.find(t => t.id === match.away_team_id)
        }));

        setMatches(matchesWithTeams);
      }

      // Load recent articles
      const { data: articlesData } = await supabase
        .from("articles")
        .select("id, title, excerpt, cover_image_url, category, published_at, is_featured")
        .eq("is_featured", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (articlesData) setArticles(articlesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section with Countdown */}
        <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2000')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-secondary/90 to-accent/85" />
          
          <div className="container mx-auto px-4 h-full relative z-10 flex flex-col items-center justify-center text-center text-white">
            <Badge className="mb-4 bg-accent text-accent-foreground border-0 px-6 py-2 text-sm">
              Mundial de Fútbol 2026
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              México Host
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-90">
              Descubre rutas turísticas, partidos y eventos del Mundial 2026
            </p>
            <Countdown />
          </div>
        </section>

        {/* Próximos Eventos - Horizontal Scroll */}
        <section className="py-12 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Próximos Eventos</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                Ver todos <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {events.map((event) => (
                <div key={event.id} className="flex-none w-[300px] snap-start">
                  <EventCard
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    imageUrl={event.imageUrl}
                    category={event.category}
                    onSave={() => console.log("Saved:", event.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rutas Turísticas */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Lugares Imperdibles</h2>
              </div>
              <Link to="/routes">
                <Button variant="ghost" size="sm" className="gap-2">
                  Ver todos <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {routes.slice(0, 4).map((route) => (
                <Card key={route.id} className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                      style={{ 
                        backgroundImage: 'url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800)'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="mb-2 bg-accent text-accent-foreground border-0">
                        Imperdible
                      </Badge>
                      <h3 className="text-white font-bold text-lg">{route.nombre}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {route.descripcion || "Explora este lugar"}
                    </p>
                    <Button variant="link" className="mt-2 p-0 h-auto text-primary">
                      Explorar →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partidos Destacados */}
        <section className="py-12 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Partidos Destacados</h2>
              </div>
              <Link to="/matches">
                <Button variant="ghost" size="sm" className="gap-2">
                  Ver calendario <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.length > 0 ? (
                matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    homeTeam={{
                      name: match.home_team?.name || "TBD",
                      code: match.home_team?.code || "TBD",
                      flag_url: match.home_team?.flag_url || undefined
                    }}
                    awayTeam={{
                      name: match.away_team?.name || "TBD",
                      code: match.away_team?.code || "TBD",
                      flag_url: match.away_team?.flag_url || undefined
                    }}
                    matchDate={match.match_date}
                    stadium={match.stadium}
                    city={match.city}
                    phase={match.phase}
                    status={match.status || "scheduled"}
                    homeScore={match.home_score || undefined}
                    awayScore={match.away_score || undefined}
                    isLive={match.status === "live"}
                    onSave={() => console.log("Saved match:", match.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Los partidos se anunciarán próximamente</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Noticias Recientes */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Newspaper className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Noticias Recientes</h2>
              </div>
              <Link to="/news">
                <Button variant="ghost" size="sm" className="gap-2">
                  Ver todas <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <Card key={article.id} className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                        style={{ 
                          backgroundImage: article.cover_image_url 
                            ? `url(${article.cover_image_url})` 
                            : 'url(https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800)'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {article.category && (
                        <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground border-0">
                          {article.category}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{article.published_at ? new Date(article.published_at).toLocaleDateString() : "Próximamente"}</span>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          Leer más →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Las noticias se publicarán próximamente</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
