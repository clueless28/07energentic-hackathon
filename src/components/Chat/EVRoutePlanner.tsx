
import { MapPin, Battery, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChargingStop {
  location: string;
  distance: string;
  chargingCost: string;
  currency: string;
  carbonIntensity: "low" | "medium" | "high";
  waitTime: string;
  amenities: string[];
}

interface EVRoutePlannerProps {
  origin?: string;
  destination?: string;
  totalDistance?: string;
  stops?: ChargingStop[];
  onViewFullRoute?: () => void;
}

// Default stops data
const defaultStops: ChargingStop[] = [
  {
    location: "Mountain View Supercharger",
    distance: "85 mi",
    chargingCost: "12.50",
    currency: "$",
    carbonIntensity: "low",
    waitTime: "25 min",
    amenities: ["Restrooms", "Food", "WiFi"]
  },
  {
    location: "Sacramento Fast Charging Station",
    distance: "120 mi",
    chargingCost: "15.75",
    currency: "$",
    carbonIntensity: "medium",
    waitTime: "30 min",
    amenities: ["Shopping", "Restrooms", "Food"]
  }
];

export const EVRoutePlanner = ({
  origin = "San Francisco, CA",
  destination = "Lake Tahoe, CA",
  totalDistance = "205 miles",
  stops = defaultStops,
  onViewFullRoute = () => console.log("View full route clicked")
}: EVRoutePlannerProps) => {
  const getCarbonBadgeColor = (intensity: "low" | "medium" | "high") => {
    switch(intensity) {
      case "low": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "medium": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "high": return "bg-red-500/10 text-red-600 border-red-500/20";
    }
  };
  
  return (
    <Card className="w-full border-emerald-400/20 bg-gradient-to-br from-card to-card/50 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-500" />
              EV Route Planner
            </CardTitle>
            <CardDescription>
              {origin} → {destination} ({totalDistance})
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-md">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{stop.location}</h4>
                  <span className="text-xs text-muted-foreground">{stop.distance}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>{stop.currency}{stop.chargingCost}</span>
                  <span className="mx-1">•</span>
                  <Battery className="h-3 w-3" />
                  <span>{stop.waitTime}</span>
                </div>
              </div>
              
              <Badge variant="outline" className={getCarbonBadgeColor(stop.carbonIntensity)}>
                {stop.carbonIntensity.charAt(0).toUpperCase() + stop.carbonIntensity.slice(1)} Carbon
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" size="sm" onClick={onViewFullRoute} className="w-full">
          View Full Route
        </Button>
      </CardFooter>
    </Card>
  );
};
