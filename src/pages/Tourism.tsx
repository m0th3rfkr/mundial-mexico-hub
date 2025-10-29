import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import {
  MapIcon,
  List,
  Search,
  MapPin,
  Utensils,
  Hotel,
  Star,
  Navigation,
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { saveToCache, loadFromCache, clearAllCache, saveUserLocation, loadUserLocation } from "@/lib/offlineCache";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

// Tipos para las ubicaciones turísticas
interface TouristLocation {
  id: string;
  nombre: string;
  descripcion: string | null;
  latitud: number | null;
  longitud: number | null;
  categoria: string;
  corredor_id: string | null;
  rating?: number;
}

const Tourism = () => {
  const [locations, setLocations] = useState<TouristLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [usingCache, setUsingCache] = useState(false);
  const { toast } = useToast();

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "✅ Conexión restablecida",
        description: "Sincronizando datos...",
      });
      loadLocations(true); // Forzar recarga
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "⚠️ Sin conexión",
        description: "Usando datos guardados",
        variant: "destructive",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Obtener ubicación del usuario
  useEffect(() => {
    const getUserLocation = async () => {
      // Intentar cargar ubicación guardada
      const savedLocation = await loadUserLocation();
      if (savedLocation) {
        setUserLocation(savedLocation);
        console.log("📍 Ubicación cargada del cache");
      }

      // Obtener ubicación actual
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(newLocation);
            await saveUserLocation(newLocation.lat, newLocation.lng);
            console.log("📍 Ubicación actualizada");
          },
          (error) => {
            console.error("Error obteniendo ubicación:", error);
            if (!savedLocation) {
              toast({
                title: "⚠️ Ubicación no disponible",
                description: "No se pudo obtener tu ubicación",
                variant: "destructive",
              });
            }
          },
        );
      }
    };

    getUserLocation();
  }, []);

  // Cargar ubicaciones al iniciar y al cambiar tab
  useEffect(() => {
    loadLocations();
  }, [activeTab]);

  const loadLocations = async (forceRefresh = false) => {
    setLoading(true);
    setUsingCache(false);

    try {
      // Intentar cargar del cache primero (si no es refresh forzado)
      if (!forceRefresh) {
        const cacheKey = `tourism-${activeTab}`;
        const cachedData = await loadFromCache(cacheKey);

        if (cachedData && cachedData.length > 0) {
          setLocations(cachedData);
          setUsingCache(true);
          setLoading(false);

          toast({
            title: "📦 Datos del cache",
            description: `${cachedData.length} ubicaciones cargadas`,
          });

          // Si estamos online, actualizar en segundo plano
          if (isOnline) {
            fetchFromSupabase(false);
          }
          return;
        }
      }

      // Si no hay cache o es refresh, cargar de Supabase
      await fetchFromSupabase(true);
    } catch (error) {
      console.error("Error cargando ubicaciones:", error);
      toast({
        title: "❌ Error",
        description: "No se pudieron cargar las ubicaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFromSupabase = async (showLoader = true) => {
    if (showLoader) setLoading(true);

    try {
      let allLocations: TouristLocation[] = [];

      if (activeTab === "all" || activeTab === "restaurantes") {
        const { data: restaurantes } = await (supabase as any)
          .from("restaurantes")
          .select("id, nombre, descripcion, latitud, longitud, corredor_id");

        if (restaurantes) {
          const filtered = restaurantes.filter((r: any) => r.latitud !== null && r.longitud !== null);
          allLocations = [
            ...allLocations,
            ...filtered.map((r: any) => ({
              id: r.id,
              nombre: r.nombre,
              descripcion: r.descripcion,
              latitud: r.latitud,
              longitud: r.longitud,
              corredor_id: r.corredor_id,
              categoria: "Restaurante",
            })),
          ];
        }
      }

      if (activeTab === "all" || activeTab === "hoteles") {
        const { data: hoteles } = await (supabase as any)
          .from("hoteles")
          .select("id, nombre, descripcion, latitud, longitud, corredor_id");

        if (hoteles) {
          const filtered = hoteles.filter((h: any) => h.latitud !== null && h.longitud !== null);
          allLocations = [
            ...allLocations,
            ...filtered.map((h: any) => ({
              id: h.id,
              nombre: h.nombre,
              descripcion: h.descripcion,
              latitud: h.latitud,
              longitud: h.longitud,
              corredor_id: h.corredor_id,
              categoria: "Hotel",
            })),
          ];
        }
      }

      if (activeTab === "all" || activeTab === "imperdibles") {
        const { data: imperdibles } = await (supabase as any)
          .from("imperdibles")
          .select("id, nombre, descripcion, latitud, longitud, corredor_id");

        if (imperdibles) {
          const filtered = imperdibles.filter((i: any) => i.latitud !== null && i.longitud !== null);
          allLocations = [
            ...allLocations,
            ...filtered.map((i: any) => ({
              id: i.id,
              nombre: i.nombre,
              descripcion: i.descripcion,
              latitud: i.latitud,
              longitud: i.longitud,
              corredor_id: i.corredor_id,
              categoria: "Imperdible",
            })),
          ];
        }
      }

      if (activeTab === "all" || activeTab === "estacionamientos") {
        const { data: estacionamientos } = await (supabase as any)
          .from("estacionamientos")
          .select("id, nombre, descripcion, latitud, longitud");

        if (estacionamientos) {
          const filtered = estacionamientos.filter((e: any) => e.latitud !== null && e.longitud !== null);
          allLocations = [
            ...allLocations,
            ...filtered.map((e: any) => ({
              id: e.id,
              nombre: e.nombre,
              descripcion: e.descripcion,
              latitud: e.latitud,
              longitud: e.longitud,
              corredor_id: null,
              categoria: "Estacionamiento",
            })),
          ];
        }
      }

      setLocations(allLocations);
      setUsingCache(false);

      // Guardar en cache
      const cacheKey = `tourism-${activeTab}`;
      await saveToCache(cacheKey, allLocations);

      if (showLoader) {
        toast({
          title: "✅ Datos actualizados",
          description: `${allLocations.length} ubicaciones cargadas`,
        });
      }
    } catch (error) {
      console.error("Error en Supabase:", error);

      if (!isOnline) {
        toast({
          title: "⚠️ Sin conexión",
          description: "Mostrando datos guardados",
          variant: "destructive",
        });
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Limpiar cache
  const handleClearCache = async () => {
    await clearAllCache();
    toast({
      title: "🗑️ Cache limpiado",
      description: "Se eliminaron todos los datos guardados",
    });
    loadLocations(true);
  };

  // Filtrar por búsqueda
  const filteredLocations = locations.filter(
    (loc) =>
      loc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Función para obtener el ícono según la categoría
  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case "Restaurante":
        return <Utensils className="h-5 w-5" />;
      case "Hotel":
        return <Hotel className="h-5 w-5" />;
      case "Imperdible":
        return <Star className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  // Abrir navegación a una ubicación
  const openNavigation = (location: TouristLocation) => {
    const destination = `${location.latitud},${location.longitud}`;
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : "";

    const url = origin
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`
      : `https://www.google.com/maps/search/?api=1&query=${destination}`;

    // Crear un link temporal y hacer click (evita bloqueadores de pop-ups)
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header con estado de conexión */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">Turismo en México</h1>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge variant="outline" className="gap-1">
                  <Wifi className="h-3 w-3" />
                  Online
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <WifiOff className="h-3 w-3" />
                  Offline
                </Badge>
              )}
              {usingCache && <Badge variant="secondary">📦 Cache</Badge>}
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Descubre restaurantes, hoteles y lugares imperdibles para tu visita al Mundial 2026
          </p>
        </div>

        {/* Barra de búsqueda y controles */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ubicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              title="Vista de lista"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("map")}
              title="Vista de mapa"
            >
              <MapIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => loadLocations(true)}
              title="Actualizar"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleClearCache} title="Limpiar cache">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs de categorías */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="restaurantes">
                <Utensils className="h-4 w-4 mr-2" />
                Restaurantes
              </TabsTrigger>
              <TabsTrigger value="hoteles">
                <Hotel className="h-4 w-4 mr-2" />
                Hoteles
              </TabsTrigger>
              <TabsTrigger value="imperdibles">
                <Star className="h-4 w-4 mr-2" />
                Imperdibles
              </TabsTrigger>
              <TabsTrigger value="estacionamientos">
                <MapPin className="h-4 w-4 mr-2" />
                Estacionamientos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{filteredLocations.length}</p>
                <p className="text-sm text-muted-foreground">Ubicaciones</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {filteredLocations.filter((l) => l.categoria === "Restaurante").length}
                </p>
                <p className="text-sm text-muted-foreground">Restaurantes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{filteredLocations.filter((l) => l.categoria === "Hotel").length}</p>
                <p className="text-sm text-muted-foreground">Hoteles</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {filteredLocations.filter((l) => l.categoria === "Imperdible").length}
                </p>
                <p className="text-sm text-muted-foreground">Imperdibles</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal */}
        <section>
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Cargando ubicaciones...</p>
            </div>
          ) : viewMode === "list" ? (
            /* Vista de Lista */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocations.map((location) => (
                <Card key={location.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCategoryIcon(location.categoria)}
                          {location.nombre}
                        </CardTitle>
                        {location.descripcion && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{location.descripcion}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{location.categoria}</Badge>
                      {location.rating && (
                        <span className="text-sm text-muted-foreground">⭐ {location.rating.toFixed(1)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          window.open(
                            `https://www.google.com/maps?q=${location.latitud},${location.longitud}`,
                            "_blank",
                          );
                        }}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => openNavigation(location)}>
                        <Navigation className="h-3 w-3 mr-1" />
                        Ir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Vista de Mapa con Google Maps */
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">📍 {filteredLocations.length} ubicaciones</p>
                  {userLocation && (
                    <Badge variant="outline" className="gap-1">
                      <Navigation className="h-3 w-3" />
                      Tu ubicación detectada
                    </Badge>
                  )}
                </div>

                <div className="w-full h-[600px] rounded-lg overflow-hidden border">
                  <APIProvider apiKey="AIzaSyAKa5EIO-wM7sPphCMqCHuXJTAQUREdJzs">
                    <Map
                      defaultCenter={{ lat: 19.4326, lng: -99.1332 }}
                      defaultZoom={12}
                      mapId="tourism-map"
                      gestureHandling="greedy"
                      disableDefaultUI={false}
                    >
                      {/* Marcador de ubicación del usuario */}
                      {userLocation && (
                        <Marker position={{ lat: userLocation.lat, lng: userLocation.lng }} title="Tu ubicación" />
                      )}

                      {/* Marcadores de ubicaciones turísticas */}
                      {filteredLocations.map(
                        (location) =>
                          location.latitud &&
                          location.longitud && (
                            <Marker
                              key={location.id}
                              position={{ lat: Number(location.latitud), lng: Number(location.longitud) }}
                              title={location.nombre}
                              onClick={() => openNavigation(location)}
                            />
                          ),
                      )}
                    </Map>
                  </APIProvider>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredLocations.slice(0, 6).map((location) => (
                    <Button
                      key={location.id}
                      variant="outline"
                      className="justify-start h-auto py-3"
                      onClick={() => openNavigation(location)}
                    >
                      <div className="flex items-start gap-2 w-full">
                        {getCategoryIcon(location.categoria)}
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{location.nombre}</p>
                          <p className="text-xs text-muted-foreground">{location.categoria}</p>
                        </div>
                        <Navigation className="h-4 w-4" />
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {!loading && filteredLocations.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron ubicaciones</h3>
                <p className="text-muted-foreground">Intenta con otra búsqueda o cambia los filtros</p>
              </div>
            </Card>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Tourism;
