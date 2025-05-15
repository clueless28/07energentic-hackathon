
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { StatsCards } from "@/components/Dashboard/StatsCards";
import { EnergyChart } from "@/components/Dashboard/EnergyChart";
import { EventsList } from "@/components/Dashboard/EventsList";
import { DeviceFeatureCards } from "@/components/Dashboard/DeviceFeatureCards";
import { TransactionHistory } from "@/components/Dashboard/TransactionHistory";
import { AIAgent } from "@/components/Dashboard/AIAgent";
import { NaturalLanguageEventInput } from "@/components/Dashboard/NaturalLanguageEventInput";
import { useWorldEngine } from "@/contexts/WorldEngineContext";
import { Link } from "react-router-dom";
import { AlertTriangle, ZapOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const { toast } = useToast();
  const { 
    gridAlerts, 
    highUsageAppliances,
    lastUpdated,
    utilityData,
    monitoringEnabled
  } = useWorldEngine();
  
  // State to track if welcome toast has been shown
  const [welcomeToastShown, setWelcomeToastShown] = useState(false);
  
  // Find critical alerts for display
  const criticalAlerts = gridAlerts.filter(alert => 
    (alert.severity === 'critical' || alert.severity === 'high')
    && monitoringEnabled // Only include alerts when monitoring is enabled
  );
  
  useEffect(() => {
    // Welcome toast when the dashboard loads - only show once
    if (!welcomeToastShown) {
      toast({
        title: "Welcome to GridSense",
        description: "Your AI agent is actively monitoring grid events"
      });
      setWelcomeToastShown(true);
    }
    
    // Show critical alerts toast only when monitoring is enabled
    if (criticalAlerts.length > 0 && monitoringEnabled) {
      toast({
        title: "Critical Grid Alert",
        description: criticalAlerts[0].message,
        variant: "destructive"
      });
    }
  }, [toast, criticalAlerts.length, monitoringEnabled, welcomeToastShown]);

  return (
    <DashboardLayout>
      <main className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold gradient-heading">Welcome to GridSense</h1>
          <p className="text-muted-foreground">Your AI-powered demand-response marketplace</p>
        </div>
        
        {/* Display critical grid alerts at the top only if present AND monitoring is enabled */}
        {criticalAlerts.length > 0 && monitoringEnabled && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Critical Grid Alert</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col gap-2">
                <p>{criticalAlerts[0].message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Link to="/grid-monitoring">
                    <Button variant="destructive" size="sm" className="gap-1">
                      <ZapOff className="h-3 w-3" />
                      View Grid Status
                    </Button>
                  </Link>
                  <Link to="/chat">
                    <Button variant="outline" size="sm">
                      Get Assistance
                    </Button>
                  </Link>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <StatsCards />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <EnergyChart />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <DeviceFeatureCards />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <EventsList />
          <AIAgent />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <NaturalLanguageEventInput />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TransactionHistory />
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Index;
