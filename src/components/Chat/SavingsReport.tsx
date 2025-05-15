
import { TrendingUp, AreaChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SavingsReportProps {
  period?: string;
  moneySaved?: string;
  currency?: string;
  energySaved?: string;
  carbonReduced?: string;
  comparisonPercent?: number;
  location?: string;
}

export const SavingsReport = ({
  period = "April 2025",
  moneySaved = "85.50",
  currency = "$",
  energySaved = "320 kWh",
  carbonReduced = "175 kg",
  comparisonPercent = 24,
  location = "Home"
}: SavingsReportProps) => {
  return (
    <Card className="w-full border-primary/20 bg-gradient-to-br from-card to-card/50 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Energy Savings Report
            </CardTitle>
            <CardDescription>Results for {period}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {location}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-primary/5 rounded-md">
            <p className="text-xs text-muted-foreground">Money Saved</p>
            <p className="text-xl font-bold text-primary">{currency}{moneySaved}</p>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-md">
            <p className="text-xs text-muted-foreground">Energy Saved</p>
            <p className="text-xl font-bold">{energySaved}</p>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-md">
            <p className="text-xs text-muted-foreground">CO₂ Reduced</p>
            <p className="text-xl font-bold">{carbonReduced}</p>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>
            You've reduced your energy consumption by <span className="font-medium text-primary">{comparisonPercent}%</span> compared 
            to similar households in your area.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
