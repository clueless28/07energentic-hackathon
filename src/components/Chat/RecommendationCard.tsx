
import { ArrowDown, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RecommendationCardProps {
  title: string;
  description: string;
  appliance: string;
  savingPercent: number;
  savingAmount: string;
  currency: string;
  timeWindow: string;
  onAccept: () => void;
  onDismiss: () => void;
}

export const RecommendationCard = ({
  title,
  description,
  appliance,
  savingPercent,
  savingAmount,
  currency,
  timeWindow,
  onAccept,
  onDismiss
}: RecommendationCardProps) => {
  return (
    <Card className="w-full border-accent/20 bg-gradient-to-br from-card to-card/50 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-accent" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            Save {savingPercent}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Recommended time: {timeWindow}</span>
        </div>
        
        <p className="text-sm mb-3">
          Shifting your <span className="font-medium">{appliance}</span> usage could save you 
          approximately <span className="font-medium text-accent">{currency}{savingAmount}</span> 
          on your next bill.
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={onDismiss} className="flex-1">
          Dismiss
        </Button>
        <Button variant="default" size="sm" onClick={onAccept} className="flex-1">
          Accept Recommendation
        </Button>
      </CardFooter>
    </Card>
  );
};
