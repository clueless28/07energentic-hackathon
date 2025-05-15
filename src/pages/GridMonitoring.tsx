
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { GridHealthDisplay } from '@/components/GridMonitoring/GridHealthDisplay';
import { GridAlertBanner } from '@/components/GridMonitoring/GridAlertBanner';
import { OptimizationRecommendation } from '@/components/GridMonitoring/OptimizationRecommendation';
import { ApplianceUsageList } from '@/components/GridMonitoring/AppllianceUsageList';
import { useWorldEngine } from '@/contexts/WorldEngineContext';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { BellRing, BellOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const GridMonitoring = () => {
  const { 
    gridAlerts, 
    highUsageAppliances, 
    recommendations,
    lastUpdated,
    isLoading,
    monitoringEnabled,
    toggleMonitoring,
    resolveAlert
  } = useWorldEngine();
  const { toast } = useToast();
  
  // Track dismissed alerts and recommendations
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<number[]>([]);
  
  // Filter out dismissed alerts
  const activeAlerts = gridAlerts.filter(
    alert => !dismissedAlertIds.includes(alert.id)
  );
  
  // Filter out dismissed recommendations
  const activeRecommendations = recommendations?.appliancesToShift.filter(
    appliance => !dismissedRecommendations.includes(appliance.derId)
  ) || [];
  
  // Handle alert dismissal
  const handleDismissAlert = (alertId: string) => {
    setDismissedAlertIds(prev => [...prev, alertId]);
    // Also resolve the alert in the context
    resolveAlert(alertId);
    
    toast({
      title: "Alert dismissed",
      description: "You can still view this alert in the history section"
    });
  };
  
  // Handle recommendation acceptance
  const handleAcceptRecommendation = (derId: number, alertId?: string) => {
    setDismissedRecommendations(prev => [...prev, derId]);
    
    // If this recommendation is related to an alert, resolve that alert
    if (alertId) {
      resolveAlert(alertId);
    }
    
    // Find matching alerts that mention this DER ID and resolve them
    const relatedAlerts = gridAlerts.filter(alert => 
      alert.affectedDerIds && alert.affectedDerIds.includes(derId)
    );
    
    relatedAlerts.forEach(alert => {
      resolveAlert(alert.id);
      // Also add to dismissed alerts to prevent UI confusion
      setDismissedAlertIds(prev => [...prev, alert.id]);
    });
    
    // In a real app, we would send this decision to a backend system
    toast({
      title: "Recommendation Accepted",
      description: "Your device usage will be optimized according to the recommendation.",
    });
  };
  
  // Handle recommendation dismissal
  const handleDismissRecommendation = (derId: number) => {
    setDismissedRecommendations(prev => [...prev, derId]);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Grid Monitoring Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time view of grid health, alerts, and optimization recommendations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {monitoringEnabled ? (
                <BellRing className="h-5 w-5 text-primary" />
              ) : (
                <BellOff className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={monitoringEnabled ? "text-primary" : "text-muted-foreground"}>
                {monitoringEnabled ? "Monitoring Active" : "Monitoring Paused"}
              </span>
            </div>
            <Switch
              checked={monitoringEnabled}
              onCheckedChange={toggleMonitoring}
              aria-label="Toggle grid monitoring"
            />
          </div>
        </div>
        
        {!monitoringEnabled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-600">
            <p className="font-medium">Grid monitoring is currently disabled</p>
            <p className="text-sm">Enable monitoring to receive real-time alerts and recommendations.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            {/* Only show critical alerts when monitoring is enabled */}
            {monitoringEnabled && (
              <div className="space-y-4">
                {activeAlerts
                  .filter(alert => alert.severity === 'critical' || alert.severity === 'high')
                  .map(alert => (
                    <GridAlertBanner 
                      key={alert.id}
                      alert={alert}
                      onDismiss={() => handleDismissAlert(alert.id)}
                    />
                  ))}
              </div>
            )}
          </div>
          
          <div>
            <GridHealthDisplay />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <ApplianceUsageList 
              appliances={monitoringEnabled ? highUsageAppliances : []}
              isLoading={isLoading && !lastUpdated && monitoringEnabled}
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Optimization Recommendations</h2>
            
            {!monitoringEnabled ? (
              <div className="text-muted-foreground text-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                Enable monitoring to see recommendations
              </div>
            ) : activeRecommendations.length === 0 ? (
              <div className="text-muted-foreground text-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                No active recommendations at this time
              </div>
            ) : (
              activeRecommendations.map((appliance) => {
                // Find if this appliance is related to any alerts
                const relatedAlert = gridAlerts.find(alert => 
                  alert.affectedDerIds && alert.affectedDerIds.includes(appliance.derId)
                );
                
                return (
                  <OptimizationRecommendation
                    key={`${appliance.derId}`}
                    appliance={appliance}
                    savingPercent={20}
                    savingAmount={(appliance.powerRating * 0.0002).toFixed(2)} // Example calculation
                    currency="$"
                    suggestedTime="After 10:00 PM"
                    onAccept={() => handleAcceptRecommendation(appliance.derId, relatedAlert?.id)}
                    onDismiss={() => handleDismissRecommendation(appliance.derId)}
                    relatedAlertId={relatedAlert?.id}
                  />
                );
              })
            )}
          </div>
        </div>
        
        {/* Only show other notifications when monitoring is enabled */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Other Notifications</h2>
          {!monitoringEnabled ? (
            <div className="text-muted-foreground text-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
              Enable monitoring to see notifications
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts
                .filter(alert => alert.severity !== 'critical' && alert.severity !== 'high')
                .map(alert => (
                  <GridAlertBanner 
                    key={alert.id}
                    alert={alert}
                    onDismiss={() => handleDismissAlert(alert.id)}
                  />
                ))}
                
              {activeAlerts.filter(alert => alert.severity !== 'critical' && alert.severity !== 'high').length === 0 && (
                <div className="text-muted-foreground text-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                  No other notifications at this time
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GridMonitoring;
