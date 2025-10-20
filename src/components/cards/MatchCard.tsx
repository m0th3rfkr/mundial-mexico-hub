import { Calendar, MapPin, Clock, Star } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Team {
  name: string;
  flag_url?: string;
  code: string;
}

interface MatchCardProps {
  homeTeam: Team;
  awayTeam: Team;
  matchDate: string;
  stadium: string;
  city: string;
  phase: string;
  status?: string;
  homeScore?: number;
  awayScore?: number;
  isLive?: boolean;
  onSave?: () => void;
  isSaved?: boolean;
}

const MatchCard = ({
  homeTeam,
  awayTeam,
  matchDate,
  stadium,
  city,
  phase,
  status = "scheduled",
  homeScore,
  awayScore,
  isLive = false,
  onSave,
  isSaved = false,
}: MatchCardProps) => {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Gradient Background - FIFA Style */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary opacity-90"></div>
      
      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-white/90 uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            {phase}
          </span>
          
          {isLive && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-white uppercase">LIVE</span>
            </div>
          )}
          
          {onSave && (
            <button
              onClick={onSave}
              className="ml-auto transition-transform hover:scale-110"
            >
              <Star 
                className={cn(
                  "h-6 w-6 transition-colors",
                  isSaved ? "fill-yellow-400 text-yellow-400" : "text-white/70"
                )} 
              />
            </button>
          )}
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-6">
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1">
            {homeTeam.flag_url ? (
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm p-2 mb-3 border-2 border-white/20">
                <img
                  src={homeTeam.flag_url}
                  alt={homeTeam.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/10 mb-3 border-2 border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{homeTeam.code}</span>
              </div>
            )}
            <p className="font-bold text-white text-center text-sm leading-tight">
              {homeTeam.name}
            </p>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center px-6">
            {status === "completed" && homeScore !== undefined && awayScore !== undefined ? (
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-white">{homeScore}</span>
                <span className="text-2xl font-bold text-white/60">-</span>
                <span className="text-4xl font-black text-white">{awayScore}</span>
              </div>
            ) : (
              <div className="text-3xl font-black text-white/80">VS</div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1">
            {awayTeam.flag_url ? (
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm p-2 mb-3 border-2 border-white/20">
                <img
                  src={awayTeam.flag_url}
                  alt={awayTeam.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/10 mb-3 border-2 border-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{awayTeam.code}</span>
              </div>
            )}
            <p className="font-bold text-white text-center text-sm leading-tight">
              {awayTeam.name}
            </p>
          </div>
        </div>

        {/* Match Info */}
        <div className="space-y-2 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {format(new Date(matchDate), "PPP 'a las' p", { locale: es })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{stadium}, {city}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
