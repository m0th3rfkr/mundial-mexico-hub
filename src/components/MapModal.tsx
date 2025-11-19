import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { X, Bike, ParkingCircle, Facebook, Twitter, Instagram } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapType: "ecobici" | "estacionamientos";
}

type MarkerData = {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  direccion?: string | null;
  capacidad_total?: number | null;
  descripcion?: string | null;
};

export const MapModal = ({ isOpen, onClose, mapType }: MapModalProps) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchMarkers();
    }
  }, [isOpen, mapType]);

  const fetchMarkers = async () => {
    setLoading(true);
    try {
      if (mapType === "ecobici") {
        const { data, error } = await supabase
          .from("estaciones_ecobici")
          .select("id, nombre, latitud, longitud, direccion, capacidad_total, descripcion")
          .eq("activa", true)
          .not("latitud", "is", null)
          .not("longitud", "is", null);

        if (error) throw error;
        if (data) {
          setMarkers(data.map(d => ({
            id: d.id,
            nombre: d.nombre,
            latitud: Number(d.latitud),
            longitud: Number(d.longitud),
            direccion: d.direccion,
            capacidad_total: d.capacidad_total,
            descripcion: d.descripcion
          })));
        }
      } else {
        const { data, error } = await supabase
          .from("estacionamientos")
          .select("id, nombre, latitud, longitud, direccion, capacidad_total, descripcion")
          .eq("activo", true)
          .not("latitud", "is", null)
          .not("longitud", "is", null);

        if (error) throw error;
        if (data) {
          setMarkers(data.map(d => ({
            id: d.id,
            nombre: d.nombre,
            latitud: Number(d.latitud),
            longitud: Number(d.longitud),
            direccion: d.direccion,
            capacidad_total: d.capacidad_total,
            descripcion: d.descripcion
          })));
        }
      }
    } catch (error) {
      console.error("Error fetching markers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Custom marker icon with green theme
  const createCustomIcon = () => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: #006847;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${mapType === "ecobici" 
              ? '<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>'
              : '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>'
            }
          </svg>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  if (!isOpen) return null;

  const title = mapType === "ecobici" ? "Estaciones Ecobici" : "Estacionamientos";
  const Icon = mapType === "ecobici" ? Bike : ParkingCircle;

  return (
    <div className="fixed inset-0 z-[9999] bg-background">
      {/* Header with Title and Close Button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md px-4">
        <Card className="bg-white shadow-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-[#006847]" />
              <h2 className="text-lg font-bold">{title}</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Counter Badge - Bottom Left */}
      <div className="absolute bottom-20 left-4 z-[10000]">
        <Card className="bg-[#006847] text-white shadow-lg border-0">
          <div className="px-4 py-2">
            <p className="text-sm font-semibold">
              {loading ? "Cargando..." : `${markers.length} ubicaciones`}
            </p>
          </div>
        </Card>
      </div>

      {/* Map */}
      {!loading && markers.length > 0 && (
        <MapContainer
          center={[19.4326, -99.1332]} // Mexico City center
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              return L.divIcon({
                html: `<div style="
                  background-color: #006847;
                  color: white;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                ">${count}</div>`,
                className: "custom-cluster-icon",
                iconSize: [40, 40],
              });
            }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.latitud, marker.longitud]}
                icon={createCustomIcon()}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-sm mb-1">{marker.nombre}</h3>
                    {marker.direccion && (
                      <p className="text-xs text-muted-foreground mb-1">{marker.direccion}</p>
                    )}
                    {marker.capacidad_total && (
                      <p className="text-xs">
                        <strong>Capacidad:</strong> {marker.capacidad_total}
                      </p>
                    )}
                    {marker.descripcion && (
                      <p className="text-xs mt-1">{marker.descripcion}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-[10000]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006847] mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Footer with Social Icons */}
      <div className="absolute bottom-0 left-0 right-0 z-[10000] bg-white border-t">
        <div className="flex items-center justify-center gap-6 py-3">
          <a
            href="#"
            className="text-[#006847] hover:text-[#004d35] transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-[#006847] hover:text-[#004d35] transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-[#006847] hover:text-[#004d35] transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};
