
import { DashboardHeader } from "./DashboardHeader";
import { Sidebar } from "./Sidebar";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 grid-bg">
      <Sidebar />
      <div className="flex-1">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};
