import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, Calendar, Star, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/teams", label: "Equipos", icon: Trophy },
    { path: "/matches", label: "Partidos", icon: Calendar },
    { path: "/favorites", label: "Favoritos", icon: Star },
    { path: "/more", label: "Más", icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1d29] border-t border-[#2d3142]">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200"
              >
                <Icon 
                  className={cn(
                    "h-5 w-5 mb-1 transition-colors",
                    isActive 
                      ? "text-white" 
                      : "text-gray-400"
                  )} 
                />
                <span 
                  className={cn(
                    "text-[10px] font-medium",
                    isActive 
                      ? "text-white" 
                      : "text-gray-400"
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
