import { Link, useLocation } from "react-router-dom";
import { Home, Map, Calendar, Star, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/routes", label: "Rutas", icon: Map },
    { path: "/matches", label: "Partidos", icon: Calendar },
    { path: "/favorites", label: "Favoritos", icon: Star },
    { path: "/more", label: "Más", icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="max-w-screen-xl mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200",
                  "hover:bg-muted/50 rounded-xl min-w-0"
                )}
              >
                <Icon 
                  className={cn(
                    "h-6 w-6 mb-1 transition-colors",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs font-medium truncate max-w-full px-1",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
