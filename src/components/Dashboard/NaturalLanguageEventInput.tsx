
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2, Check, Settings, BarChart3, Cog } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BecknBranding } from "@/components/BecknBranding";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export const NaturalLanguageEventInput = () => {
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [impactDetails, setImpactDetails] = useState<{
    eventTitle: string;
    eventDate: string;
    locations: string[];
    impact: string;
    savings: string;
  } | null>(null);
  const { toast } = useToast();

  // Process steps
  const processingSteps = [
    "Analyzing your request...",
    "Configuring affected devices...",
    "Checking grid stability and pricing...",
    "Calculating potential savings...",
    "Finalizing optimizations..."
  ];

  // Reset progress when processing is complete
  useEffect(() => {
    if (processingComplete) {
      const timer = setTimeout(() => {
        setProcessingComplete(false);
        setProcessingStep(0);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [processingComplete]);

  // Advance processing step
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (isProcessing && processingStep < processingSteps.length) {
      timer = setTimeout(() => {
        setProcessingStep(prev => prev + 1);
        
        // When we reach the last step, complete the processing
        if (processingStep === processingSteps.length - 1) {
          processUserInput();
        }
      }, 800);
    }
    
    return () => clearTimeout(timer);
  }, [isProcessing, processingStep]);

  // Process the user input with basic NLP simulation
  const processUserInput = async () => {
    try {
      // Extract potential location keywords from the input
      const locationKeywords = [
        "living room", "bedroom", "kitchen", "bathroom", "office",
        "basement", "garage", "hallway", "dining room", "attic"
      ];
      
      // Extract potential event type keywords from the input
      const eventTypeKeywords = {
        "party": "party",
        "dinner": "dinner",
        "away": "away_from_home",
        "vacation": "away_from_home",
        "trip": "away_from_home",
        "meeting": "meeting",
        "guests": "guests",
        "visit": "guests",
        "movie": "entertainment",
        "sleep": "sleeping",
        "night": "night_mode"
      };
      
      const inputLower = userInput.toLowerCase();
      
      // Extract locations mentioned in input
      const detectedLocations = locationKeywords.filter(loc => 
        inputLower.includes(loc)
      );
      
      // Default to common rooms if none detected
      const locations = detectedLocations.length > 0 
        ? detectedLocations 
        : ["Living Room", "Kitchen"];
      
      // Detect event type
      let eventType = "custom";
      let eventTitle = "Custom Event";
      
      Object.entries(eventTypeKeywords).forEach(([keyword, type]) => {
        if (inputLower.includes(keyword)) {
          eventType = type;
          eventTitle = type.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
        }
      });
      
      // Determine event date - check for date keywords
      let eventDate = new Date();
      const dateKeywords = {
        "today": 0,
        "tomorrow": 1,
        "next week": 7,
        "next month": 30
      };
      
      Object.entries(dateKeywords).forEach(([keyword, daysToAdd]) => {
        if (inputLower.includes(keyword)) {
          const newDate = new Date();
          newDate.setDate(newDate.getDate() + daysToAdd);
          eventDate = newDate;
        }
      });
      
      // Calculate a random savings amount between $1.50 and $5.00
      const savingsAmount = (Math.random() * 3.5 + 1.5).toFixed(2);
      
      // Set impact details
      setImpactDetails({
        eventTitle: eventTitle,
        eventDate: eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        locations: locations.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
        impact: `Optimized energy usage in ${locations.length} ${locations.length === 1 ? 'area' : 'areas'}`,
        savings: `$${savingsAmount}`
      });
      
      // Create event ID
      const eventId = `event-${Date.now()}`;
      
      // Store the energy plan in Supabase
      await supabase.from('energy_plans').insert([{
        id: uuidv4(),
        event_type: eventType,
        event_title: eventTitle,
        description: userInput,
        event_date: eventDate.toISOString(),
        locations,
        impact: `Optimized energy usage in ${locations.length} ${locations.length === 1 ? 'area' : 'areas'}`,
        savings: `$${savingsAmount}`,
      }]);
      
      // Display response in toast
      toast({
        title: "Event processed successfully",
        description: `Energy will be optimized in ${locations.join(', ')} for your ${eventTitle} on ${eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`,
      });
      
      // Dispatch custom event for components to respond to
      const customEvent = new CustomEvent('grid:event:participation', {
        detail: {
          eventId,
          affectedDeviceTypes: ["hvac", "lighting", "appliance"],
          locations,
          active: true,
          eventDate,
          eventType,
          eventTitle,
          userDescription: userInput
        }
      });
      window.dispatchEvent(customEvent);
      
      // Add event to AI agent
      const agentEvent = new CustomEvent('ai:agent:new-task', {
        detail: {
          taskId: eventId,
          taskType: 'event-preparation',
          description: `Prepare for ${eventTitle} on ${eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`,
          details: {
            eventType,
            eventDate,
            affectedLocations: locations
          }
        }
      });
      window.dispatchEvent(agentEvent);
      
      // Complete processing
      setIsProcessing(false);
      setProcessingComplete(true);

    } catch (error) {
      console.error("Error processing input:", error);
      toast({
        title: "Processing error",
        description: "There was an error understanding your plans. Please try again.",
        variant: "destructive",
      });
      
      setIsProcessing(false);
      setProcessingStep(0);
    }
  };

  // Function to process natural language input
  const processNaturalLanguageEvent = () => {
    if (!userInput.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter an event description",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingStep(0);
    setProcessingComplete(false);
    setImpactDetails(null);
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Tell AI About Your Plans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="Enter your plans in natural language. For example: 'I have a birthday party next Tuesday' or 'I'll be out of town on Wednesday'"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="min-h-[100px]"
        />
        
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{processingSteps[processingStep]}</span>
              <span>{processingStep + 1}/{processingSteps.length}</span>
            </div>
            <Progress value={((processingStep + 1) / processingSteps.length) * 100} className="h-2" />
          </div>
        )}
        
        {processingComplete && impactDetails && (
          <div className="bg-gridsense-50/50 border border-gridsense-100 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-gridsense-600">
              <Check className="h-5 w-5" />
              <h3 className="font-medium">Event Successfully Configured</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Event</div>
                <div className="font-medium">{impactDetails.eventTitle}</div>
                <div className="text-sm flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{impactDetails.eventDate}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Impact</div>
                <div className="flex items-center gap-1.5">
                  <Cog className="h-4 w-4 text-gridsense-600" />
                  <span>{impactDetails.impact}</span>
                </div>
                <div className="flex items-center gap-1.5 text-green-600">
                  <BarChart3 className="h-4 w-4" />
                  <span>Projected savings: {impactDetails.savings}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Affected Areas</div>
              <div className="flex flex-wrap gap-1">
                {impactDetails.locations.map((location, index) => (
                  <span 
                    key={index}
                    className="bg-gridsense-100 text-gridsense-700 text-xs px-2 py-1 rounded-full"
                  >
                    {location}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <BecknBranding variant="compact" />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>AI will optimize device schedules based on your plans</span>
          </div>
          <Button 
            onClick={processNaturalLanguageEvent}
            disabled={isProcessing || !userInput.trim()}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : "Process Event"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
