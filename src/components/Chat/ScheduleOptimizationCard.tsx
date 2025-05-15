
import { Calendar, Clock, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ScheduleRecommendation {
  deviceName: string;
  currentTime: string;
  suggestedTime: string;
  savings: string;
  reduction: string;
  currency: string;
}

interface ScheduleOptimizationCardProps {
  recommendations: ScheduleRecommendation[];
  onApply: () => void;
  onDecline: () => void;
}

export const ScheduleOptimizationCard = ({
  recommendations,
  onApply,
  onDecline
}: ScheduleOptimizationCardProps) => {
  // Calculate total savings
  const totalSavings = recommendations
    .reduce((sum, rec) => sum + parseFloat(rec.savings), 0)
    .toFixed(2);
  
  // Get currency from first recommendation (assuming all use same currency)
  const currency = recommendations.length > 0 ? recommendations[0].currency : "$";

  return (
    <Card className="w-full border-primary/20 bg-gradient-to-br from-card to-card/50 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule Optimization
            </CardTitle>
            <CardDescription>Recommendations for optimal energy usage times</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Save {currency}{totalSavings}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div 
              key={index} 
              className="p-3 bg-muted/50 rounded-md border border-border/50"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium">{recommendation.deviceName}</h4>
                <span className="text-xs text-accent">
                  Save {recommendation.currency}{recommendation.savings}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-sm mb-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Currently: </span>
                <span>{recommendation.currentTime}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm">
                <TrendingDown className="h-3.5 w-3.5 text-primary" />
                <span className="text-muted-foreground">Suggested: </span>
                <span className="font-medium text-primary">{recommendation.suggestedTime}</span>
                <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  -{recommendation.reduction}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-primary/5 rounded-md border border-primary/10">
          <p className="text-sm">
            Applying these schedule changes could save you approximately 
            <span className="font-medium text-primary"> {currency}{totalSavings}</span> on 
            your next energy bill while reducing your carbon footprint.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={onDecline} className="flex-1">
          Keep Current Schedule
        </Button>
        <Button variant="default" size="sm" onClick={onApply} className="flex-1">
          Apply New Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};
