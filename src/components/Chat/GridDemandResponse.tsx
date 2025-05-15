
import { useState } from 'react';
import { Zap, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useWorldEngine } from '@/contexts/WorldEngineContext';
import { ApplianceUsageData } from '@/utils/worldEngine/types';

interface GridDemandResponseProps {
  appliance: ApplianceUsageData;
  gridStressLevel: number; // 0-100
  rewardAmount: string;
  currency: string;
  carbonSavings: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const GridDemandResponse = ({
  appliance,
  gridStressLevel,
  rewardAmount,
  currency,
  carbonSavings,
  onAccept,
  onDecline
}: GridDemandResponseProps) => {
  const { toast } = useToast();
  const [isAccepted, setIsAccepted] = useState(false);
  
  // Get color based on grid stress level
  const getStressColor = () => {
    if (gridStressLevel < 40) return 'text-green-500';
    if (gridStressLevel < 70) return 'text-yellow-500';
    if (gridStressLevel < 90) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const handleAccept = () => {
    setIsAccepted(true);
    onAccept();
    toast({
      title: "Demand Response Accepted",
      description: `Thank you for helping balance the grid. You'll earn ${currency}${rewardAmount}`,
    });
  };
  
  const handleDecline = () => {
    onDecline();
    toast({
      title: "Demand Response Declined",
      description: "You'll receive future opportunities to help.",
    });
  };

  return (
    <Card className="w-full border-accent/20 bg-gradient-to-br from-card to-card/50 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Grid Flexibility Request
            </CardTitle>
            <CardDescription>High demand detected</CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={
              gridStressLevel >= 90 ? "bg-red-500/10 text-red-500 border-red-200" :
              gridStressLevel >= 70 ? "bg-orange-500/10 text-orange-500 border-orange-200" :
              gridStressLevel >= 40 ? "bg-yellow-500/10 text-yellow-500 border-yellow-200" :
              "bg-green-500/10 text-green-500 border-green-200"
            }
          >
            {gridStressLevel >= 90 ? "Critical" :
             gridStressLevel >= 70 ? "High" : 
             gridStressLevel >= 40 ? "Medium" : 
             "Low"} Stress
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Grid Stress Level</span>
            <span className={getStressColor()}>{gridStressLevel}%</span>
          </div>
          <Progress 
            value={gridStressLevel} 
            className={`h-2 ${
              gridStressLevel >= 90 ? 'bg-red-100 [&>div]:bg-red-500' :
              gridStressLevel >= 70 ? 'bg-orange-100 [&>div]:bg-orange-500' :
              gridStressLevel >= 40 ? 'bg-yellow-100 [&>div]:bg-yellow-500' :
              'bg-green-100 [&>div]:bg-green-500'
            }`} 
          />
        </div>
        
        <p className="text-sm mb-3">
          Your <span className="font-medium">{appliance.applianceName}</span> is contributing to high grid demand. 
          Would you be willing to temporarily reduce its usage for a reward?
        </p>
        
        <div className="flex items-center justify-between text-sm mb-2 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Temporary reduction (15 min)</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>CO₂ saved: {carbonSavings}</span>
          </div>
        </div>
        
        {isAccepted && (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-md text-green-600 dark:text-green-400 text-sm">
            Thank you for participating! Your reward of {currency}{rewardAmount} will be credited to your account.
          </div>
        )}
      </CardContent>
      
      {!isAccepted && (
        <CardFooter className="flex justify-between gap-2">
          <Button variant="outline" size="sm" onClick={handleDecline} className="flex-1">
            Decline
          </Button>
          <Button variant="default" size="sm" onClick={handleAccept} className="flex-1">
            Accept ({currency}{rewardAmount})
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
