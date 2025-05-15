
import { Activity, Grid2X2, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface UsagePattern {
  deviceName: string;
  timePattern: string;
  frequency: string;
  averageDuration: string;
  averageConsumption: string;
  optimizationSuggestion?: string;
}

interface UsagePatternDetailProps {
  patterns: UsagePattern[];
  onOptimize: () => void;
  hasConsent?: boolean;
}

export const UsagePatternDetail = ({
  patterns,
  onOptimize,
  hasConsent = true // Default to true so existing code works without changes
}: UsagePatternDetailProps) => {
  return (
    <Card className="w-full border-primary/20 bg-gradient-to-br from-card to-card/50 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Grid2X2 className="h-5 w-5 text-primary" />
              Usage Pattern Insights
            </CardTitle>
            <CardDescription>
              Based on your energy consumption data
            </CardDescription>
          </div>
          
          {hasConsent ? (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Monitoring Active
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
              Consent Needed
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {hasConsent ? (
          <div className="space-y-4">
            {patterns.map((pattern, index) => (
              <div key={index} className="bg-card/80 p-3 rounded-lg border border-border/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{pattern.deviceName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {pattern.frequency}
                  </Badge>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Time of use:</span>
                  <span>{pattern.timePattern}</span>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Duration:</span>
                  <span>{pattern.averageDuration}</span>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Energy usage:</span>
                  <span>{pattern.averageConsumption}</span>
                </div>
                
                {pattern.optimizationSuggestion && (
                  <div className="mt-2 text-xs py-1 px-2 bg-primary/10 text-primary rounded">
                    Tip: {pattern.optimizationSuggestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <Settings className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-center mb-3">
              To provide usage pattern insights and personalized recommendations, 
              we need your consent to analyze your energy meter data.
            </p>
          </div>
        )}
      </CardContent>
      
      {!hasConsent && (
        <CardFooter>
          <Button onClick={onOptimize} className="w-full">
            Grant Consent for Pattern Analysis
          </Button>
        </CardFooter>
      )}
      
      {hasConsent && (
        <CardFooter>
          <Button onClick={onOptimize} variant="outline" size="sm" className="w-full">
            Optimize My Schedule
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
