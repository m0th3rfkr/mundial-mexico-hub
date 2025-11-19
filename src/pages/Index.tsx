import { useState, useEffect } from "react";
import { MapPin, Calendar, Newspaper, ChevronRight, Trophy, Utensils, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Countdown from "@/components/Countdown";
import MatchCard from "@/components/cards/MatchCard";
import EventCard from "@/components/cards/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

const Index = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [rssArticles, setRssArticles] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
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

  const heroSlides = [
    {
      id: 1,
      title: "Descubre la CDMX",
      subtitle: "Explora lo mejor de la capital",
      image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=1200",
      buttonText: "RUTAS TURÍSTICAS",
      buttonLink: "/tourism"
    },
    {
      id: 2,
      title: "Mundial 2026",
      subtitle: "Vive la experiencia del fútbol",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200",
      buttonText: "VER PARTIDOS",
      buttonLink: "/matches"
    },
    {
      id: 3,
      title: "Equipos del Mundo",
      subtitle: "Conoce a las selecciones participantes",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200",
      buttonText: "VER EQUIPOS",
      buttonLink: "/teams"
    }
  ];

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

      // Load RSS articles for horizontal scroll
      const { data: rssData } = await supabase
        .from("articles")
        .select("id, title, excerpt, cover_image_url, published_at")
        .order("published_at", { ascending: false })
        .limit(6);
      if (rssData) setRssArticles(rssData);

      // Load restaurants
      const { data: restaurantsData } = await supabase
        .from("restaurantes")
        .select("id, nombre, imagen_principal_url, latitud, longitud, destacado")
        .eq("activo", true)
        .order("destacado", { ascending: false })
        .limit(6);
      if (restaurantsData) setRestaurants(restaurantsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Carousel */}
        <section className="relative">
          <Carousel
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {heroSlides.map((slide) => (
                <CarouselItem key={slide.id}>
                  <div className="relative h-[40vh] overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
                    
                    <div className="container mx-auto px-4 h-full relative z-10 flex flex-col items-center justify-center text-center text-white">
                      <h2 className="text-4xl md:text-6xl font-bold mb-4">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl mb-8 opacity-90">
                        {slide.subtitle}
                      </p>
                      <Link to={slide.buttonLink}>
                        <Button 
                          size="lg" 
                          className="bg-[#006847] hover:bg-[#00854d] text-white font-bold px-8 py-6 text-base rounded-full"
                        >
                          {slide.buttonText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Countdown Card - Burgundy Style */}
        <section className="container mx-auto px-4 -mt-12 relative z-20">
          <Card className="overflow-hidden bg-[#962044] border-0 shadow-2xl">
            <CardContent className="p-4 text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Trophy className="h-6 w-6 text-yellow-400" />
                <h3 className="text-xl md:text-2xl font-bold">PATADA INICIAL</h3>
              </div>
              <p className="text-base mb-4 opacity-90">Faltan</p>
              <Countdown />
              <Link to="/matches">
                <Button 
                  variant="link" 
                  className="text-yellow-400 hover:text-yellow-300 mt-4 text-base font-semibold"
                >
                  Ver Inauguración →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* RSS Yahoo News - Horizontal Scroll */}
        <section className="py-12 mt-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">RSS Yahoo</h2>
              <Link to="/news">
                <Button variant="ghost" size="sm" className="gap-2">
                  Ver todas <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {rssArticles.map((article) => (
                <Card key={article.id} className="flex-none w-[300px] snap-start overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ 
                        backgroundImage: article.cover_image_url 
                          ? `url(${article.cover_image_url})` 
                          : 'url(https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800)'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-2">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString('es-MX', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : "Próximamente"}
                    </p>
                    <h3 className="font-bold text-base mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {article.excerpt || "Lee más sobre esta noticia"}
                    </p>
                    <div className="flex items-center justify-between">
                      <Link to={`/news/${article.id}`}>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          Leer más →
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => console.log("Saved:", article.id)}
                      >
                        <Newspaper className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Próximos Eventos - Horizontal Scroll */}
        <section className="py-12 bg-card/50 mt-12">
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

        {/* Lugares Imperdibles */}
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

        {/* Dónde Comer */}
        <section className="py-12 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Utensils className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Dónde Comer</h2>
              </div>
              <Link to="/tourism">
                <Button variant="ghost" size="sm" className="gap-2">
                  Ver todos <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {restaurants.map((restaurant, index) => {
                // Generate mock distance (in future, calculate from user location)
                const distances = ["886 m", "1.2 km", "1.5 km", "2.1 km", "750 m", "3.2 km"];
                const distance = distances[index % distances.length];
                
                return (
                  <Card key={restaurant.id} className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                        style={{ 
                          backgroundImage: restaurant.imagen_principal_url 
                            ? `url(${restaurant.imagen_principal_url})` 
                            : 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800)'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      
                      {/* Distance Badge - Bottom Left */}
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-white/90 text-foreground border-0 backdrop-blur-sm font-semibold">
                          {distance}
                        </Badge>
                      </div>
                      
                      {/* Bookmark Icon - Top Right */}
                      <button 
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Saved restaurant:", restaurant.id);
                        }}
                      >
                        <Bookmark className="h-4 w-4 text-foreground" />
                      </button>
                    </div>
                    
                    <CardContent className="p-3">
                      <h3 className="font-bold text-sm md:text-base line-clamp-2 min-h-[2.5rem]">
                        {restaurant.nombre}
                      </h3>
                    </CardContent>
                  </Card>
                );
              })}
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
