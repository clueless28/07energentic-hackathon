
import React from 'react';
import { Activity, AlertCircle, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useWorldEngine } from '@/contexts/WorldEngineContext';

export const GridHealthDisplay = () => {
  const { 
    peakSubstations, 
    peakTransformers, 
    lastUpdated,
    isLoading
  } = useWorldEngine();

  // Calculate overall grid health percentage
  const calculateGridHealth = (): number => {
    // If no data yet, return 100%
    if (peakSubstations.length === 0 && peakTransformers.length === 0) {
      return 100;
    }

    // Calculate average health across substations and transformers
    let totalPercentage = 0;
    let totalCount = 0;

    // Add substation percentages
    peakSubstations.forEach(substation => {
      if (substation.usagePercentage !== undefined) {
        totalPercentage += (100 - substation.usagePercentage);
        totalCount++;
      }
    });

    // Add transformer percentages
    peakTransformers.forEach(transformer => {
      if (transformer.usagePercentage !== undefined) {
        totalPercentage += (100 - transformer.usagePercentage);
        totalCount++;
      }
    });

    // If no percentages found, return 100%
    if (totalCount === 0) return 100;

    // Return average health
    return totalPercentage / totalCount;
  };

  const gridHealth = calculateGridHealth();
  
  // Get color based on health
  const getHealthColor = () => {
    if (gridHealth >= 80) return 'text-green-500';
    if (gridHealth >= 60) return 'text-yellow-500';
    if (gridHealth >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  // Get message based on health
  const getHealthMessage = () => {
    if (gridHealth >= 80) return 'Grid is operating optimally';
    if (gridHealth >= 60) return 'Grid is moderately stressed';
    if (gridHealth >= 40) return 'Grid is experiencing significant stress';
    return 'Critical grid condition - immediate action required';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Grid Health Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && !lastUpdated ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <div className={`text-2xl font-bold ${getHealthColor()}`}>
                {gridHealth.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: {lastUpdated?.toLocaleTimeString()}
              </div>
            </div>
            
            <Progress
              value={gridHealth}
              className={`h-2 ${
                gridHealth >= 80
                  ? 'bg-green-100 [&>div]:bg-green-500'
                  : gridHealth >= 60
                  ? 'bg-yellow-100 [&>div]:bg-yellow-500'
                  : gridHealth >= 40
                  ? 'bg-orange-100 [&>div]:bg-orange-500'
                  : 'bg-red-100 [&>div]:bg-red-500'
              }`}
            />
            
            <div className="flex items-center mt-4 text-sm">
              {gridHealth < 60 && (
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              )}
              <span className={gridHealth < 60 ? 'text-red-600' : 'text-muted-foreground'}>
                {getHealthMessage()}
              </span>
            </div>
            
            <div className="mt-2 text-xs text-muted-foreground">
              {peakTransformers.length > 0 && (
                <p>
                  {peakTransformers.length} transformer{peakTransformers.length !== 1 ? 's' : ''} under high load
                </p>
              )}
              {peakSubstations.length > 0 && (
                <p>
                  {peakSubstations.length} substation{peakSubstations.length !== 1 ? 's' : ''} under high load
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
