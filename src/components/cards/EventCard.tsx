import { MapPin, Clock, Bell } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  date: string;
  time?: string;
  location: string;
  category?: string;
  onSave?: () => void;
  isSaved?: boolean;
}

const EventCard = ({
  title,
  description,
  imageUrl,
  date,
  time,
  location,
  category,
  onSave,
  isSaved = false,
}: EventCardProps) => {
  const eventDate = new Date(date);
  const day = format(eventDate, "dd");
  const month = format(eventDate, "MMM", { locale: es }).toUpperCase();

  return (
    <div className="relative bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Date Badge */}
      <div className="absolute top-4 left-4 z-10 bg-accent rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
        <span className="text-2xl font-black text-accent-foreground leading-none">{day}</span>
        <span className="text-xs font-bold text-accent-foreground mt-0.5">{month}</span>
      </div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"></div>
        
        {category && (
          <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-bold text-primary-foreground uppercase tracking-wide">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-card-foreground mb-3 line-clamp-2 leading-tight">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm truncate">{location}</span>
          </div>
          
          {time && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{time}</span>
            </div>
          )}
        </div>

        {onSave && (
          <button
            onClick={onSave}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200",
              isSaved
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <Bell className="h-4 w-4" />
            {isSaved ? "Guardado" : "Guardar evento"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
