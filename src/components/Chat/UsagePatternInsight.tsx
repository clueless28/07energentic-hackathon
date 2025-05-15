
import { Clock, AreaChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UsagePattern {
  deviceName: string;
  timePattern: string;
  frequency: string;
  averageDuration: string;
  averageConsumption: string;
  optimizationSuggestion?: string;
}

interface UsagePatternInsightProps {
  patterns: UsagePattern[];
  onOptimize: () => void;
}

export const UsagePatternInsight = ({ patterns, onOptimize }: UsagePatternInsightProps) => {
  return (
    <Card className="w-full border-blue-400/20 bg-gradient-to-br from-card to-card/50 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Usage Pattern Analysis
            </CardTitle>
            <CardDescription>Identified routines based on your energy usage</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {patterns.map((pattern, index) => (
            <div key={index} className="p-3 bg-blue-400/5 rounded-md">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium">{pattern.deviceName}</h4>
                <span className="text-xs text-muted-foreground">{pattern.frequency}</span>
              </div>
              <p className="text-sm mb-1">
                <Clock className="h-3.5 w-3.5 inline mr-1" />
                {pattern.timePattern}
              </p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Average duration: {pattern.averageDuration}</span>
                <span>Consumption: {pattern.averageConsumption}</span>
              </div>
              
              {pattern.optimizationSuggestion && (
                <div className="mt-2 text-xs py-1 px-2 bg-blue-400/10 text-blue-500 rounded">
                  Tip: {pattern.optimizationSuggestion}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" size="sm" onClick={onOptimize} className="w-full">
          Optimize My Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};
