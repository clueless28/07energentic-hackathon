
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demandResponseEvents } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BecknBranding } from "@/components/BecknBranding";
import { becknInit, becknConfirm, toggleDer, listMeters, BPP_ID } from "@/utils/becknProtocol";
import { v4 as uuidv4 } from 'uuid';

export const EventsList = () => {
  const { toast } = useToast();
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [bidStage, setBidStage] = useState(0);
  const [bidProgress, setBidProgress] = useState(0);
  const [affectedDeviceIds, setAffectedDeviceIds] = useState([]);

  const handleParticipate = (eventId) => {
    const event = demandResponseEvents.find(e => e.id === eventId);
    setCurrentEvent(event);
    setShowBidDialog(true);
    setBidStage(0);
    setBidProgress(0);
    
    // Determine which devices will be affected based on event eligibility
    if (event && event.deviceEligibility) {
      // This will be used to update device states after bid acceptance
      const deviceTypes = event.deviceEligibility.map(type => type.toLowerCase());
      // Will match device types like "Air Conditioner", "Fan", etc.
      setAffectedDeviceIds(deviceTypes);
    }
    
    // Simulate progress
    const interval = setInterval(() => {
      setBidProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBidStage(1);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateBidWin = async () => {
    setBidStage(2);
    setBidProgress(0);
    
    try {
      // Use Beckn protocol to process the bid
      console.log("Processing bid using Beckn protocol");
      
      // Simulate a bid processing with Beckn protocol
      const now = new Date();
      const later = new Date(now.getTime() + 15 * 60 * 1000);
      
      const fulfillmentOptions = [{
        id: uuidv4(),
        start: now.toISOString(),
        end: later.toISOString()
      }];
      
      // Initialize bid through Beckn
      const initResponse = await becknInit(
        currentEvent?.id || "default-provider", 
        `event-${currentEvent?.id}`, 
        fulfillmentOptions
      );
      
      const orderId = initResponse.message.order.id;
      console.log(`Bid initialized with order ID: ${orderId}`);
      
      // Try to toggle DER devices through Beckn
      try {
        const meters = await listMeters();
        if (meters && meters.length > 0) {
          const derId = meters[0].id;
          await toggleDer(derId);
          console.log(`Toggled DER ${derId} for this event`);
        }
      } catch (err) {
        console.warn("Could not toggle DER, continuing bid process:", err);
      }
      
      // Confirm the bid through Beckn
      const fulfillment = {
        id: uuidv4(),
        agent_id: BPP_ID || "default-agent", // Add the required agent_id
        start: now.toISOString(),
        end: later.toISOString()
      };
      
      await becknConfirm(orderId, fulfillment);
      console.log("Bid confirmed through Beckn protocol");
      
      // Continue with the UI flow
      const interval = setInterval(() => {
        setBidProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setBidStage(3);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } catch (error) {
      console.error("Error processing bid through Beckn:", error);
      
      // Fall back to the regular flow if Beckn fails
      const interval = setInterval(() => {
        setBidProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setBidStage(3);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
  };

  const closeBidDialog = () => {
    if (bidStage === 3) {
      // Dispatch a custom event to notify DeviceFeatureCards about the participation
      if (currentEvent) {
        const eventDetails = {
          eventId: currentEvent.id,
          affectedDeviceTypes: affectedDeviceIds,
          eventType: currentEvent.type || 'demand_response',
          active: true
        };
        
        // Create and dispatch custom event for device state changes
        const customEvent = new CustomEvent('grid:event:participation', { 
          detail: eventDetails
        });
        window.dispatchEvent(customEvent);
        
        toast({
          title: "Participation confirmed",
          description: "Your AI agent will handle this event automatically",
        });
      }
    }
    setShowBidDialog(false);
    setBidStage(0);
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Available Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {demandResponseEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{event.title}</h3>
                  <p className="text-xs text-muted-foreground">{event.date} • {event.timeRange}</p>
                </div>
                <Badge
                  variant={event.status === "active" ? "default" : "outline"}
                  className={
                    event.status === "active"
                      ? "bg-green-500/20 text-green-700 hover:bg-green-500/20 border-green-200"
                      : ""
                  }
                >
                  {event.status === "active" ? (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Live
                    </span>
                  ) : (
                    "Upcoming"
                  )}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Incentive</span>
                  <span className="font-medium">{event.incentive}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Potential</span>
                  <span className="font-medium">{event.potentialEarnings}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">AI Recommends</span>
                  <span className="font-medium flex items-center gap-1 text-green-600">
                    <Check className="h-3 w-3" /> Accept
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {event.participants} households participating
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 gap-1"
                  onClick={() => handleParticipate(event.id)}
                >
                  Participate <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>

      {/* Bidding Dialog */}
      {currentEvent && (
        <Dialog open={showBidDialog} onOpenChange={closeBidDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{currentEvent.title}</DialogTitle>
              <DialogDescription>
                {bidStage === 0 && "Your AI agent is analyzing and placing a competitive bid..."}
                {bidStage === 1 && "Your AI agent has prepared an optimal bid strategy"}
                {bidStage === 2 && "Processing bid and comparing with other participants..."}
                {bidStage === 3 && "Congratulations! Your bid was accepted"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {(bidStage === 0 || bidStage === 2) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{bidStage === 0 ? "Analyzing opportunity" : "Processing bid via Beckn protocol"}</span>
                    <span>{bidProgress}%</span>
                  </div>
                  <Progress value={bidProgress} className="h-2" />
                </div>
              )}

              {bidStage === 1 && (
                <div className="space-y-4">
                  <div className="border rounded-md p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Bid Strategy</span>
                      <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/20 border-blue-200">
                        AI Optimized
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Proposed Rate</span>
                        <span className="font-medium">{currentEvent.incentive}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Duration</span>
                        <span className="font-medium">{currentEvent.timeRange}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Affected Devices</span>
                        <span className="font-medium">{currentEvent.deviceEligibility.join(', ')}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Estimated Earnings</span>
                        <span className="font-medium text-green-600">{currentEvent.potentialEarnings}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 text-xs text-muted-foreground border-t">
                      <p>AI Recommendation: {currentEvent.aiRecommendation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center py-2">
                    <BecknBranding variant="compact" />
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBidDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={simulateBidWin}>
                      Submit Bid
                    </Button>
                  </DialogFooter>
                </div>
              )}

              {bidStage === 3 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border-green-200 border rounded-md p-4 text-center">
                    <div className="rounded-full bg-green-100 h-12 w-12 flex items-center justify-center mx-auto mb-3">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-700">Bid Accepted!</h3>
                    <p className="text-sm text-green-600 mt-1">
                      Your AI agent will manage your devices during the event
                    </p>
                  </div>
                  
                  <div className="space-y-2 p-3 border rounded-md">
                    <div className="flex justify-between text-sm">
                      <span>Event Duration</span>
                      <span className="font-medium">{currentEvent.timeRange}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Devices Participating</span>
                      <span className="font-medium">{currentEvent.deviceEligibility.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expected Earnings</span>
                      <span className="font-medium text-green-600">{currentEvent.potentialEarnings}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center py-2">
                    <BecknBranding variant="inline" />
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={closeBidDialog}>
                      Done
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
