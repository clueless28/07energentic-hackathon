
import { Lightbulb, Check, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EnergySavingTip {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  savingsEstimate: string;
  difficulty: string;
  category: string;
}

interface EnergySavingTipsCardProps {
  tips: EnergySavingTip[];
  onSaveTips: () => void;
}

export const EnergySavingTipsCard = ({
  tips,
  onSaveTips
}: EnergySavingTipsCardProps) => {
  // Helper function to get impact colors
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "text-green-600 bg-green-100";
      case "Medium": 
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Card className="w-full border-yellow-400/20 bg-gradient-to-br from-card to-card/50 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Energy Saving Tips
            </CardTitle>
            <CardDescription>Personalized recommendations based on your usage patterns</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {tips.map((tip, index) => (
            <div 
              key={index} 
              className="p-3 bg-card rounded-lg border shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{tip.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(tip.impact)}`}>
                  {tip.impact} Impact
                </span>
              </div>
              <p className="text-sm mb-3">{tip.description}</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Savings: {tip.savingsEstimate}</span>
                <span>Difficulty: {tip.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" size="sm" onClick={onSaveTips} className="w-full">
          <Star className="h-4 w-4 mr-2" />
          Save These Tips
        </Button>
      </CardFooter>
    </Card>
  );
};
