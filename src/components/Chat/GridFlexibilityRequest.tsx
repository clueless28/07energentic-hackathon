
import { Zap, Clock, Battery } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface GridFlexibilityRequestProps {
  deviceName: string;
  duration: number; // in minutes
  rewardAmount: string;
  currency: string;
  carbonSavings: string;
  urgency: "low" | "medium" | "high";
  onAccept: () => void;
  onDecline: () => void;
}

export const GridFlexibilityRequest = ({
  deviceName,
  duration,
  rewardAmount,
  currency,
  carbonSavings,
  urgency,
  onAccept,
  onDecline
}: GridFlexibilityRequestProps) => {
  const { toast } = useToast();
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration * 60); // Convert to seconds
  const [progress, setProgress] = useState(100);
  
  const urgencyColor = {
    low: "text-green-500",
    medium: "text-orange-500",
    high: "text-red-500"
  };
  
  const urgencyBg = {
    low: "bg-green-500/10",
    medium: "bg-orange-500/10",
    high: "bg-red-500/10"
  };
  
  const handleAccept = () => {
    setIsCountingDown(true);
    toast({
      title: "Request Accepted",
      description: `${deviceName} will be paused for ${duration} minutes.`,
    });
    
    // Simulate countdown
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newVal = prev - 1;
        setProgress((newVal / (duration * 60)) * 100);
        
        if (newVal <= 0) {
          clearInterval(interval);
          setIsCountingDown(false);
          toast({
            title: "Grid Request Completed",
            description: `Thank you for participating! You've earned ${currency}${rewardAmount}.`,
          });
          onAccept();
        }
        return newVal;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  };
  
  return (
    <Card className={`w-full border-accent/20 ${urgencyBg[urgency]} animate-fade-in`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className={`h-5 w-5 ${urgencyColor[urgency]}`} />
              Grid Flexibility Request
            </CardTitle>
            <CardDescription>
              {new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              }).format(new Date())}
            </CardDescription>
          </div>
          <Badge variant="outline" className={`${urgencyBg[urgency]} ${urgencyColor[urgency]} border-${urgencyColor[urgency]}/20`}>
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)} Urgency
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm mb-3">
          The grid is experiencing high demand. Would you allow us to temporarily 
          pause your <span className="font-medium">{deviceName}</span> for {duration} minutes?
        </p>
        
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Reward: <strong>{currency}{rewardAmount}</strong></span>
          <span>CO₂ avoided: <strong>{carbonSavings}</strong></span>
        </div>
        
        {isCountingDown && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Time remaining:</span>
              <span className="font-medium">
                {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      {!isCountingDown && (
        <CardFooter className="flex justify-between gap-2">
          <Button variant="outline" size="sm" onClick={onDecline} className="flex-1">
            Decline
          </Button>
          <Button variant="default" size="sm" onClick={handleAccept} className="flex-1">
            Accept Request
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
