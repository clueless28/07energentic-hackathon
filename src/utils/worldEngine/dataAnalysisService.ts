
import { 
  WorldEngineResponse, 
  ApplianceUsageData, 
  PeakUsageData,
  GridAlert
} from './types';
import { v4 as uuidv4 } from 'uuid';

// Calculate utility usage hierarchy (substations, transformers, meters)
export function calculateHierarchyUsage(data: WorldEngineResponse) {
  // Sample implementation to extract high usage appliances from data
  let highUsageAppliances: ApplianceUsageData[] = [];
  
  // Process data to find high usage appliances
  data.utilities.forEach(utility => {
    utility.substations?.forEach(substation => {
      substation.transformers?.forEach(transformer => {
        transformer.meters?.forEach(meter => {
          if (meter.energyResource?.ders) {
            meter.energyResource.ders.forEach(der => {
              if (der.switched_on && der.appliance) {
                // Consider any appliance with power rating > 700W as "high usage"
                if (der.appliance.powerRating > 700) {
                  highUsageAppliances.push({
                    derId: der.id,
                    applianceId: der.appliance.id,
                    applianceName: der.appliance.name,
                    powerRating: der.appliance.powerRating,
                    location: {
                      city: meter.city,
                      state: meter.state
                    },
                    meterId: meter.id,
                    meterCode: meter.code,
                    transformerId: transformer.id,
                    transformerName: transformer.name,
                    substationId: substation.id,
                    substationName: substation.name,
                    utilityId: utility.id,
                    utilityName: utility.name,
                    switched_on: der.switched_on,
                    updatedAt: der.updatedAt,
                    resourceOwnerName: meter.energyResource.name
                  });
                }
              }
            });
          }
        });
      });
    });
  });
  
  // Sort by power rating (highest first)
  highUsageAppliances.sort((a, b) => b.powerRating - a.powerRating);
  
  return {
    utilityUsage: 0, // Placeholder for actual calculation
    highUsageAppliances
  };
}

// Identify peak usage components at each level
export function identifyPeakUsage(data: WorldEngineResponse) {
  // Placeholders for actual calculation
  const peakMeters: PeakUsageData[] = [];
  const peakTransformers: PeakUsageData[] = [];
  const peakSubstations: PeakUsageData[] = [];
  
  // Return the results
  return {
    peakMeters,
    peakTransformers,
    peakSubstations
  };
}

// Generate grid alerts based on data analysis
export function generateGridAlerts(data: WorldEngineResponse): GridAlert[] {
  const alerts: GridAlert[] = [];
  let appliancesOverThreshold: ApplianceUsageData[] = [];
  
  // Find appliances over threshold
  data.utilities.forEach(utility => {
    utility.substations?.forEach(substation => {
      substation.transformers?.forEach(transformer => {
        transformer.meters?.forEach(meter => {
          if (meter.energyResource?.ders) {
            meter.energyResource.ders.forEach(der => {
              if (der.switched_on && der.appliance) {
                // Set thresholds for different alert levels
                if (der.appliance.powerRating > 1400) {
                  appliancesOverThreshold.push({
                    derId: der.id,
                    applianceId: der.appliance.id,
                    applianceName: der.appliance.name,
                    powerRating: der.appliance.powerRating,
                    location: {
                      city: meter.city,
                      state: meter.state
                    },
                    meterId: meter.id,
                    meterCode: meter.code,
                    transformerId: transformer.id,
                    transformerName: transformer.name,
                    substationId: substation.id,
                    substationName: substation.name,
                    utilityId: utility.id,
                    utilityName: utility.name,
                    switched_on: der.switched_on,
                    updatedAt: der.updatedAt,
                    resourceOwnerName: meter.energyResource.name
                  });
                }
              }
            });
          }
        });
      });
    });
  });
  
  // Generate alerts for appliances over threshold
  appliancesOverThreshold.forEach(appliance => {
    // Calculate potential savings (estimate)
    const potentialSavingsKW = appliance.powerRating * 0.3; // 30% reduction
    const potentialSavingsPercent = 30;
    
    // Determine severity based on power rating
    let severity: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (appliance.powerRating > 1800) {
      severity = 'critical';
    } else if (appliance.powerRating > 1500) {
      severity = 'high';
    } else if (appliance.powerRating > 1200) {
      severity = 'medium';
    }
    
    // Create the alert
    alerts.push({
      id: uuidv4(),
      severity,
      message: `High energy usage detected for ${appliance.applianceName} (${appliance.powerRating}W)`,
      timestamp: new Date(),
      affectedComponents: [`Meter ${appliance.meterId}`, `Transformer ${appliance.transformerId}`],
      affectedDerIds: [appliance.derId], // Add affected DER IDs here
      potentialSavingsKW,
      potentialSavingsPercent,
      suggestedAction: `Consider shifting usage of ${appliance.applianceName} to off-peak hours`
    });
  });
  
  // Ensure at least one critical alert for demonstration purposes
  if (!alerts.some(alert => alert.severity === 'critical')) {
    // Generate a synthetic critical alert
    alerts.push({
      id: uuidv4(),
      severity: 'critical',
      message: 'Grid capacity approaching critical threshold',
      timestamp: new Date(),
      affectedComponents: ['Multiple transformers', 'Substation power limit'],
      affectedDerIds: appliancesOverThreshold.map(a => a.derId),
      potentialSavingsKW: 2.5,
      potentialSavingsPercent: 25,
      suggestedAction: 'Reduce usage of high-power appliances during the next 2 hours'
    });
  }
  
  return alerts;
}

// Get optimization recommendations
export function getOptimizationRecommendations(data: WorldEngineResponse) {
  // Extract high usage appliances
  const { highUsageAppliances } = calculateHierarchyUsage(data);
  
  // Filter for appliances that should be shifted to different time
  const appliancesToShift = highUsageAppliances.filter(
    appliance => appliance.powerRating > 800
  );
  
  // Calculate total potential savings
  const potentialSavingsKW = appliancesToShift.reduce(
    (total, appliance) => total + (appliance.powerRating * 0.3) / 1000,
    0
  );
  
  return {
    appliancesToShift,
    potentialSavingsKW
  };
}
