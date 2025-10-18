import { MapPin, Calendar, Newspaper } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Countdown from "@/components/Countdown";
import { Link } from "react-router-dom";

const Index = () => {
  const venues = [
    { city: "Ciudad de México", stadium: "Estadio Azteca", icon: "🏟️" },
    { city: "Guadalajara", stadium: "Estadio Akron", icon: "⚽" },
    { city: "Monterrey", stadium: "Estadio BBVA", icon: "🎯" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2000')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent" />
          
          <div className="container mx-auto relative z-10 text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Mundial 2026
            </h1>
            <p className="text-2xl md:text-3xl mb-4 animate-fade-in">
              México Host
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90 animate-fade-in">
              La Copa del Mundo regresa a México. Prepárate para vivir la experiencia futbolística más grande del planeta.
            </p>
            <div className="flex gap-4 justify-center animate-fade-in">
              <Link to="/matches">
                <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-all">
                  Ver Partidos
                </Button>
              </Link>
              <Link to="/teams">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all">
                  Explorar Equipos
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Cuenta Regresiva
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Faltan para el inicio del Mundial
            </p>
            <Countdown />
          </div>
        </section>

        {/* Venues Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <MapPin className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                Sedes en México
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <Card key={venue.city} className="group hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-accent">
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-4">{venue.icon}</div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {venue.city}
                    </CardTitle>
                    <CardDescription className="text-lg">{venue.stadium}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Newspaper className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                Noticias Destacadas
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="group hover:shadow-lg transition-all hover:scale-105">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg" />
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      Noticia Destacada {i}
                    </CardTitle>
                    <CardDescription>
                      Mantente informado sobre las últimas novedades del Mundial 2026
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/news">
                      <Button variant="ghost" className="w-full">
                        Leer más
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Matches Preview */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Calendar className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                Próximos Partidos
              </h2>
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                El calendario de partidos estará disponible próximamente
              </p>
              <Link to="/matches">
                <Button size="lg" className="shadow-lg">
                  Ver Calendario Completo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
