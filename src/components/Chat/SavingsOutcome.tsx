
import { TrendingDown, Activity, ChartBar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SavingsOutcomeProps {
  period: string;
  moneySaved: string;
  currency: string;
  energySaved: string;
  carbonReduced: string;
  comparisonPercent: number;
  actionTaken: string;
  location?: string;
}

export const SavingsOutcome = ({
  period,
  moneySaved,
  currency,
  energySaved,
  carbonReduced,
  comparisonPercent,
  actionTaken,
  location = "Home"
}: SavingsOutcomeProps) => {
  return (
    <Card className="w-full border-green-500/20 bg-gradient-to-br from-card to-card/50 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <ChartBar className="h-5 w-5 text-green-500" />
              Savings Report: {period}
            </CardTitle>
            <CardDescription>Results from {actionTaken}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            {comparisonPercent > 0 ? "+" : ""}{comparisonPercent}% vs. Previous
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col items-center p-3 bg-card/80 rounded-lg border border-border/50">
            <TrendingDown className="h-5 w-5 text-green-500 mb-1" />
            <span className="text-lg font-bold">{currency}{moneySaved}</span>
            <span className="text-xs text-muted-foreground">Money Saved</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-card/80 rounded-lg border border-border/50">
            <Activity className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-lg font-bold">{energySaved}</span>
            <span className="text-xs text-muted-foreground">Energy Saved</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-card/80 rounded-lg border border-border/50">
            <ChartBar className="h-5 w-5 text-amber-500 mb-1" />
            <span className="text-lg font-bold">{carbonReduced}</span>
            <span className="text-xs text-muted-foreground">CO₂ Reduced</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          These savings were achieved at your {location} through smart energy management. 
          Keep up the good work!
        </p>
      </CardContent>
    </Card>
  );
};
