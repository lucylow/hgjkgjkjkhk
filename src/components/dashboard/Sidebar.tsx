import { Home, Cpu, BarChart3, Bell, Wrench, Settings, ChevronRight, Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Cpu, label: "Equipment", path: "/equipment" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Bell, label: "Alerts", path: "/alerts", badge: 3 },
  { icon: Wrench, label: "Maintenance", path: "/maintenance" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <TooltipProvider>
      <div className="h-screen w-64 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">PredictIQ</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== "/" && location.pathname.startsWith(item.path));
              
              return (
                <li key={item.path}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <Badge 
                              variant={isActive ? "secondary" : "destructive"} 
                              className="h-5 min-w-5 flex items-center justify-center text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight className={cn(
                            "w-4 h-4 opacity-0 -translate-x-1 transition-all",
                            isActive && "opacity-100 translate-x-0"
                          )} />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/50">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@predictiq.com</p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};