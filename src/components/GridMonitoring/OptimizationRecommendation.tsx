
import React from 'react';
import { LightbulbIcon, Clock, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ApplianceUsageData } from '@/utils/worldEngine/types';

interface OptimizationRecommendationProps {
  appliance: ApplianceUsageData;
  savingPercent: number;
  savingAmount: string;
  currency: string;
  suggestedTime: string;
  onAccept: () => void;
  onDismiss: () => void;
  relatedAlertId?: string;
}

export const OptimizationRecommendation = ({
  appliance,
  savingPercent,
  savingAmount,
  currency,
  suggestedTime,
  onAccept,
  onDismiss,
  relatedAlertId
}: OptimizationRecommendationProps) => {
  const { toast } = useToast();
  
  const handleAccept = () => {
    toast({
      title: "Recommendation Accepted",
      description: relatedAlertId 
        ? `Your ${appliance.applianceName} usage will be shifted to ${suggestedTime}. Related alert resolved.`
        : `Your ${appliance.applianceName} usage will be shifted to ${suggestedTime}.`,
    });
    onAccept();
  };

  return (
    <Card className="w-full border-accent/20 bg-gradient-to-br from-card to-card/50 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <LightbulbIcon className="h-5 w-5 text-yellow-500" />
              Shift {appliance.applianceName} Usage
            </CardTitle>
            <CardDescription>Grid optimization recommendation</CardDescription>
          </div>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            Save {savingPercent}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Recommended time: {suggestedTime}</span>
        </div>
        
        <p className="text-sm mb-3">
          We've detected high usage from your <span className="font-medium">{appliance.applianceName}</span>.
          Shifting this usage could save you approximately <span className="font-medium text-accent">{currency}{savingAmount}</span> 
          and help balance the grid.
          {relatedAlertId && (
            <span className="block mt-1 text-red-600">
              This recommendation will resolve a related grid alert.
            </span>
          )}
        </p>
        
        <div className="text-xs text-muted-foreground">
          <p>Device owner: {appliance.resourceOwnerName}</p>
          <p>Location: {appliance.location.city}, {appliance.location.state}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={onDismiss} className="flex-1">
          Dismiss
        </Button>
        <Button variant="default" size="sm" onClick={handleAccept} className="flex-1">
          Accept Recommendation
        </Button>
      </CardFooter>
    </Card>
  );
};
