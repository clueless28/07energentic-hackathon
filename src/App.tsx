
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Events from "./pages/Events";
import Schedule from "./pages/Schedule";
import Marketplace from "./pages/Marketplace";
import Agent from "./pages/Agent";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import GridMonitoring from "./pages/GridMonitoring";
import { ChatProvider } from "./contexts/ChatContext";
import { WorldEngineProvider } from "./contexts/WorldEngineContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <WorldEngineProvider pollingInterval={10000}>
          <ChatProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/events" element={<Events />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/agent" element={<Agent />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/grid-monitoring" element={<GridMonitoring />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </WorldEngineProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
