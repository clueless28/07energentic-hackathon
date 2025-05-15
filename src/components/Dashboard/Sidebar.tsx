
import { useState } from "react";
import { Calendar, Grid, HomeIcon, LayoutDashboard, ListChecks, MessageCircle, Plus, Settings, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, to, active }: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3",
        active ? "bg-accent/10 text-accent font-medium" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      )}
      asChild
    >
      <Link to={to}>
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    </Button>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="w-56 hidden md:flex flex-col border-r h-screen bg-white dark:bg-gray-950 sticky top-0">
      <div className="p-4">
        <div className="flex flex-col space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            to="/"
            active={pathname === "/"} 
          />
          <SidebarItem 
            icon={ListChecks} 
            label="Events" 
            to="/events"
            active={pathname === "/events"} 
          />
          <SidebarItem 
            icon={Calendar} 
            label="Schedule" 
            to="/schedule"
            active={pathname === "/schedule"} 
          />
          <SidebarItem 
            icon={Users} 
            label="Marketplace" 
            to="/marketplace"
            active={pathname === "/marketplace"} 
          />
          <SidebarItem 
            icon={User} 
            label="AI Agent" 
            to="/agent"
            active={pathname === "/agent"} 
          />
          <SidebarItem 
            icon={MessageCircle} 
            label="Chat" 
            to="/chat"
            active={pathname === "/chat"} 
          />
          <SidebarItem 
            icon={Grid} 
            label="Grid Monitoring" 
            to="/grid-monitoring"
            active={pathname === "/grid-monitoring"} 
          />
          <SidebarItem 
            icon={User} 
            label="My Profile" 
            to="/profile"
            active={pathname === "/profile"} 
          />
        </div>
      </div>
      <div className="mt-auto p-4 border-t">
        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          to="/settings"
          active={pathname === "/settings"} 
        />
      </div>
    </div>
  );
};
