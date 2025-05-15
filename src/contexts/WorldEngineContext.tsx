
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  fetchUtilityData 
} from '@/utils/worldEngine/apiService';
import {
  calculateHierarchyUsage,
  identifyPeakUsage,
  generateGridAlerts,
  getOptimizationRecommendations
} from '@/utils/worldEngine/dataAnalysisService';
import { 
  WorldEngineResponse, 
  ApplianceUsageData, 
  PeakUsageData,
  GridAlert
} from '@/utils/worldEngine/types';
import { useToast } from '@/hooks/use-toast';

interface WorldEngineContextType {
  utilityData: WorldEngineResponse | null;
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  highUsageAppliances: ApplianceUsageData[];
  peakMeters: PeakUsageData[];
  peakTransformers: PeakUsageData[];
  peakSubstations: PeakUsageData[];
  gridAlerts: GridAlert[];
  recommendations: {
    appliancesToShift: ApplianceUsageData[];
    potentialSavingsKW: number;
  } | null;
  monitoringEnabled: boolean;
  toggleMonitoring: () => void;
  resolveAlert: (alertId: string) => void;
}

const WorldEngineContext = createContext<WorldEngineContextType | undefined>(undefined);

export const useWorldEngine = () => {
  const context = useContext(WorldEngineContext);
  if (!context) {
    throw new Error('useWorldEngine must be used within a WorldEngineProvider');
  }
  return context;
};

interface WorldEngineProviderProps {
  children: ReactNode;
  pollingInterval?: number; // in milliseconds
}

export const WorldEngineProvider = ({ 
  children, 
  pollingInterval = 30000 // Changed to 30 seconds to reduce API calls
}: WorldEngineProviderProps) => {
  const [utilityData, setUtilityData] = useState<WorldEngineResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [highUsageAppliances, setHighUsageAppliances] = useState<ApplianceUsageData[]>([]);
  const [peakMeters, setPeakMeters] = useState<PeakUsageData[]>([]);
  const [peakTransformers, setPeakTransformers] = useState<PeakUsageData[]>([]);
  const [peakSubstations, setPeakSubstations] = useState<PeakUsageData[]>([]);
  const [gridAlerts, setGridAlerts] = useState<GridAlert[]>([]);
  const [recommendations, setRecommendations] = useState<{
    appliancesToShift: ApplianceUsageData[];
    potentialSavingsKW: number;
  } | null>(null);
  const [monitoringEnabled, setMonitoringEnabled] = useState<boolean>(false); // Changed default to false
  
  const { toast } = useToast();

  // Function to fetch data and update state
  const fetchData = async () => {
    // Skip if monitoring is disabled
    if (!monitoringEnabled) return;
    
    try {
      setIsLoading(true);
      const data = await fetchUtilityData();
      setUtilityData(data);
      
      // Process data to extract insights
      const { utilityUsage, highUsageAppliances: highUsage } = calculateHierarchyUsage(data);
      const { peakMeters: peaks1, peakTransformers: peaks2, peakSubstations: peaks3 } = identifyPeakUsage(data);
      const alerts = generateGridAlerts(data);
      const recs = getOptimizationRecommendations(data);
      
      // Update state with processed data
      setHighUsageAppliances(highUsage);
      setPeakMeters(peaks1);
      setPeakTransformers(peaks2);
      setPeakSubstations(peaks3);
      setGridAlerts(alerts);
      setRecommendations(recs);
      setLastUpdated(new Date());
      
      // Show toast for new critical alerts
      const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
      if (criticalAlerts.length > 0) {
        toast({
          title: "Critical Grid Alert",
          description: criticalAlerts[0].message,
          variant: "destructive"
        });
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error fetching world engine data:', err);
      
      toast({
        title: "API Connection Error",
        description: "Could not connect to grid monitoring system. Using fallback data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle monitoring state
  const toggleMonitoring = () => {
    const newState = !monitoringEnabled;
    setMonitoringEnabled(newState);
    
    // Show appropriate toast
    if (newState) {
      toast({
        title: "Monitoring Enabled",
        description: "Grid monitoring is now active. You will receive alerts and recommendations."
      });
      // Immediately fetch data when monitoring is enabled
      fetchData();
    } else {
      toast({
        title: "Monitoring Disabled",
        description: "Grid monitoring is now paused. You will not receive alerts or recommendations."
      });
    }
  };
  
  // Resolve specific alert by ID
  const resolveAlert = (alertId: string) => {
    setGridAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  // Initial data fetch only when monitoring is enabled
  useEffect(() => {
    if (monitoringEnabled) {
      fetchData();
    }
    
    // Set up polling interval only if monitoring is enabled
    let intervalId: NodeJS.Timeout | undefined;
    if (monitoringEnabled) {
      intervalId = setInterval(fetchData, pollingInterval);
    }
    
    // Clean up on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pollingInterval, monitoringEnabled]);

  return (
    <WorldEngineContext.Provider
      value={{
        utilityData,
        isLoading,
        error,
        lastUpdated,
        highUsageAppliances,
        peakMeters,
        peakTransformers,
        peakSubstations,
        gridAlerts,
        recommendations,
        monitoringEnabled,
        toggleMonitoring,
        resolveAlert
      }}
    >
      {children}
    </WorldEngineContext.Provider>
  );
};
