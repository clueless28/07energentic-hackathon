
import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GridAlert } from '@/utils/worldEngine/types';

interface GridAlertBannerProps {
  alert: GridAlert;
  onDismiss?: () => void;
}

export const GridAlertBanner = ({ alert, onDismiss }: GridAlertBannerProps) => {
  // Determine the appropriate styling based on severity
  const getAlertStyling = () => {
    switch (alert.severity) {
      case 'critical':
        return {
          icon: <AlertCircle className="h-5 w-5 text-destructive" />,
          bgColor: 'bg-destructive/15',
          borderColor: 'border-destructive/30',
          textColor: 'text-destructive'
        };
      case 'high':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          bgColor: 'bg-amber-500/15',
          borderColor: 'border-amber-500/30',
          textColor: 'text-amber-500'
        };
      case 'medium':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
          bgColor: 'bg-orange-500/15',
          borderColor: 'border-orange-500/30',
          textColor: 'text-orange-500'
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          bgColor: 'bg-blue-500/15',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-500'
        };
    }
  };

  const { icon, bgColor, borderColor, textColor } = getAlertStyling();
  
  // Format the timestamp
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(alert.timestamp);

  return (
    <Alert className={`mb-4 ${bgColor} border ${borderColor} animate-fade-in`}>
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <AlertTitle className={`flex justify-between items-center ${textColor}`}>
            <span className="font-semibold">
              {alert.severity === 'critical' ? 'Critical Grid Alert' : 
               alert.severity === 'high' ? 'High Priority Alert' :
               alert.severity === 'medium' ? 'Medium Priority Alert' : 'Grid Notice'}
            </span>
            <span className="text-xs font-normal">{formattedTime}</span>
          </AlertTitle>
          <AlertDescription className="mt-1">
            <p className="mb-1">{alert.message}</p>
            <p className="text-sm font-medium mt-2">{alert.suggestedAction}</p>
            <p className="text-xs mt-1">
              Potential savings: {alert.potentialSavingsKW.toFixed(2)} kW ({alert.potentialSavingsPercent}% reduction)
            </p>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};
