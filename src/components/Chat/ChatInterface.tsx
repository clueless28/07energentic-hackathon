import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { WaveformAnimation } from "./WaveformAnimation";
import { ChatMessage } from "./ChatMessage";
import { QuickReplyButton } from "./QuickReplyButton";
import { useChatContext, Message } from "@/contexts/ChatContext";
import { UsageChart } from "./UsageChart";
import { SavingsReport } from "./SavingsReport";
import { UsagePatternDetail } from "./UsagePatternDetail";
import { EVRoutePlanner } from "./EVRoutePlanner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { EnergyRecommendation } from "./EnergyRecommendation";
import { GridFlexibilityRequest } from "./GridFlexibilityRequest";
import { SavingsOutcome } from "./SavingsOutcome";
import { GridDemandResponse } from "./GridDemandResponse";
import { useWorldEngine } from "@/contexts/WorldEngineContext";
import { Link } from "react-router-dom";
import { ScheduleOptimizationCard } from "./ScheduleOptimizationCard";
import { EnergySavingTipsCard } from "./EnergySavingTipsCard";

// Enhanced quick replies - removed "Grid status" and "View grid alerts"
const quickReplies = [
  { id: 1, text: "Show my usage" },
  { id: 2, text: "Optimize my schedule" },
  { id: 3, text: "Energy saving tips" },
  { id: 4, text: "Plan EV trip" },
  { id: 5, text: "View savings report" },
  { id: 6, text: "Usage patterns" },
  { id: 7, text: "Shift usage recommendations" }
];

// Sample usage patterns for demonstration
const sampleUsagePatterns = [
  {
    appliance: "Dishwasher",
    timeOfDay: "Daily at 6:00 PM",
    frequency: "Daily",
    energyUsage: "1.5 kWh per use",
    costEstimate: "0.45",
    currency: "$"
  },
  {
    appliance: "Water Heater",
    timeOfDay: "5:30 AM - 7:30 AM",
    frequency: "Weekdays",
    energyUsage: "3.2 kWh per day",
    costEstimate: "0.96",
    currency: "$"
  },
  {
    appliance: "EV Charger",
    timeOfDay: "10:00 PM - 6:00 AM",
    frequency: "3x per week",
    energyUsage: "12 kWh per charge",
    costEstimate: "3.60",
    currency: "$"
  }
];

// Sample data for schedule optimization
const sampleOptimizationData = [
  {
    deviceName: "Washing Machine",
    currentTime: "4:00 PM - 5:00 PM",
    suggestedTime: "10:00 PM - 11:00 PM",
    savings: "1.25",
    reduction: "30%",
    currency: "$"
  },
  {
    deviceName: "Dishwasher",
    currentTime: "7:00 PM - 8:00 PM",
    suggestedTime: "11:00 PM - 12:00 AM",
    savings: "0.95",
    reduction: "25%",
    currency: "$"
  },
  {
    deviceName: "EV Charger",
    currentTime: "6:00 PM - 9:00 PM",
    suggestedTime: "1:00 AM - 4:00 AM",
    savings: "3.50",
    reduction: "40%",
    currency: "$"
  }
];

// Sample data for energy saving tips
const sampleSavingTips = [
  {
    title: "Thermostat Adjustment",
    description: "Adjust your thermostat by 1-2 degrees to save up to 10% on heating and cooling costs",
    impact: "High",
    savingsEstimate: "$15-30 monthly",
    difficulty: "Easy",
    category: "Heating & Cooling"
  },
  {
    title: "Off-peak EV Charging",
    description: "Schedule your EV charging during off-peak hours (10PM-6AM) to reduce electricity costs by up to 30%",
    impact: "High",
    savingsEstimate: "$20-45 monthly",
    difficulty: "Easy",
    category: "Transportation"
  },
  {
    title: "Energy Star Appliances",
    description: "Consider upgrading your kitchen appliances to Energy Star models for 15-20% greater efficiency",
    impact: "Medium",
    savingsEstimate: "$100-200 yearly",
    difficulty: "Moderate",
    category: "Appliances"
  },
  {
    title: "Smart Power Strips",
    description: "Install smart power strips to eliminate phantom energy usage from electronics",
    impact: "Low",
    savingsEstimate: "$5-10 monthly",
    difficulty: "Easy",
    category: "Electronics"
  }
];

// Transform sample usage patterns to the correct format
const transformedUsagePatterns = sampleUsagePatterns.map(pattern => ({
  deviceName: pattern.appliance,
  timePattern: pattern.timeOfDay,
  frequency: pattern.frequency,
  averageDuration: "45 minutes",
  averageConsumption: pattern.energyUsage,
  optimizationSuggestion: `Consider shifting to off-peak hours to save ${pattern.currency}${pattern.costEstimate} per use`
}));

export const ChatInterface = () => {
  const { messages, isLoading, sendMessage, activeConversationId } = useChatContext();
  const { 
    gridAlerts, 
    highUsageAppliances,
    recommendations,
    lastUpdated,
    peakMeters,
    peakTransformers
  } = useWorldEngine();
  
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasPatternConsent, setHasPatternConsent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Effect to check for grid alerts and prompt the user
  useEffect(() => {
    // Only show grid alert messages if we have critical or high alerts
    const criticalAlerts = gridAlerts.filter(alert => 
      alert.severity === 'critical' || alert.severity === 'high'
    );
    
    if (criticalAlerts.length > 0 && highUsageAppliances.length > 0 && activeConversationId) {
      // Create an AI message about the grid alert
      const gridAlertMessage: Message = {
        id: uuidv4(),
        type: "system",
        content: `<div class="space-y-4">
          <p>Alert: We've detected high grid stress in your area. Your ${highUsageAppliances[0]?.applianceName || 'appliance'} 
          is currently contributing to this issue.</p>
          <div data-component="GridDemandResponse" data-props='{"appliance": ${JSON.stringify(highUsageAppliances[0])}, 
          "gridStressLevel": 85, "rewardAmount": "4.50", "currency": "$", "carbonSavings": "2.3 kg CO₂"}'>
          </div>
        </div>`,
        timestamp: new Date(),
      };
      
      // Save this message to Supabase and add it to the conversation
      // This should happen only once, so we'd need additional logic in a real app
      // For demo purposes, we'll just show a toast notification instead of sending the message
      if (criticalAlerts.length === 1) { // First alert only
        toast({
          title: "Grid Alert Detected",
          description: "Critical grid condition detected. Check the chat for details.",
          variant: "destructive"
        });
      }
    }
  }, [gridAlerts, highUsageAppliances, activeConversationId]);

  // Mock voice recognition
  const toggleVoiceRecognition = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate voice recognition result
      if (transcript) {
        handleSendMessage(transcript);
        setTranscript("");
      }
    } else {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setTranscript("Show me my energy savings this month");
      }, 2000);
    }
  };

  // Handle predefined quick replies without using Gemini
  const handleQuickReply = async (text: string) => {
    const quickReplyId = uuidv4();
    const quickReplyMessage: Message = {
      id: quickReplyId,
      type: "user",
      content: text,
      timestamp: new Date(),
    };
    
    // Generate appropriate response based on quick reply content
    let responseMessage: Message | null = null;
    
    switch (text.toLowerCase()) {
      case "show my usage":
        responseMessage = {
          id: uuidv4(),
          type: "system",
          content: "<UsageChart/>",
          timestamp: new Date(),
        };
        break;
        
      case "optimize my schedule":
        responseMessage = {
          id: uuidv4(),
          type: "system",
          content: `<div class="space-y-4">
            <p>I've analyzed your usage patterns and identified opportunities to optimize your energy schedule.</p>
            <div data-component="ScheduleOptimizationCard" 
              data-props='${JSON.stringify({ recommendations: sampleOptimizationData })}'>
            </div>
          </div>`,
          timestamp: new Date(),
        };
        break;
        
      case "energy saving tips":
        responseMessage = {
          id: uuidv4(),
          type: "system",
          content: `<div class="space-y-4">
            <p>Here are some personalized energy saving tips based on your usage patterns:</p>
            <div data-component="EnergySavingTipsCard" 
              data-props='${JSON.stringify({ tips: sampleSavingTips })}'>
            </div>
          </div>`,
          timestamp: new Date(),
        };
        break;
        
      case "plan ev trip":
        responseMessage = {
          id: uuidv4(),
          type: "system",
          content: "<EVRoutePlanner/>",
          timestamp: new Date(),
        };
        break;
        
      case "view savings report":
        responseMessage = {
          id: uuidv4(),
          type: "system",
          content: "<SavingsReport/>",
          timestamp: new Date(),
        };
        break;
        
      case "usage patterns":
        responseMessage = {
          id: uuidv4(),
          type: "system",
          content: "<UsagePatternInsight/>",
          timestamp: new Date(),
        };
        break;
        
      case "shift usage recommendations":
        // Use real world engine data if available
        if (recommendations && recommendations.appliancesToShift.length > 0) {
          const appliance = recommendations.appliancesToShift[0];
          responseMessage = {
            id: uuidv4(),
            type: "system",
            content: `<div class="space-y-4">
              <p>I've analyzed your energy usage patterns and found opportunities to save money by shifting when you use certain appliances:</p>
              <div data-component="EnergyRecommendation" 
                data-props='{"title":"Shift ${appliance.applianceName}", "description":"Off-peak tariff opportunity", "appliance":"${appliance.applianceName}", "savingPercent":20, "savingAmount":"3.25", "currency":"$", "timeWindow":"After 10 PM"}'>
              </div>
            </div>`,
            timestamp: new Date(),
          };
        } else {
          // Fallback to default recommendation
          responseMessage = {
            id: uuidv4(),
            type: "system",
            content: `<div class="space-y-4">
              <p>I've analyzed your energy usage patterns and found opportunities to save money by shifting when you use certain appliances:</p>
              <div data-component="EnergyRecommendation" 
                data-props='{"title":"Shift Water Heating", "description":"UK off-peak tariff opportunity", "appliance":"Water Heater", "savingPercent":20, "savingAmount":"2.50", "currency":"£", "timeWindow":"After 10 PM"}'>
              </div>
            </div>`,
            timestamp: new Date(),
          };
        }
        break;
        
      default:
        // For unknown quick replies, use the regular Gemini flow
        handleSendMessage(text);
        return;
    }
    
    // Save messages to Supabase if we have an active conversation
    try {
      if (activeConversationId) {
        // Save user message
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: activeConversationId,
            content: quickReplyMessage.content,
            type: quickReplyMessage.type,
          }]);
        
        // Save system response
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: activeConversationId,
            content: responseMessage.content,
            type: responseMessage.type,
          }]);
      }
    } catch (error) {
      console.error("Error saving quick reply messages:", error);
    }
    
    // Update context with both user input and system response
    sendMessage(text, responseMessage);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Use the context's sendMessage function
    await sendMessage(content);
    setInputValue("");
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied to your clipboard",
    });
  };

  const renderComponentFromContent = (content: string) => {
    // Check for custom component markers
    if (content.includes("data-component=\"EnergyRecommendation\"")) {
      try {
        const propsMatch = content.match(/data-props='(.+?)'/);
        if (propsMatch && propsMatch[1]) {
          const props = JSON.parse(propsMatch[1]);
          return (
            <div className="mt-4">
              <EnergyRecommendation 
                {...props}
                onAccept={() => toast({
                  title: "Recommendation Accepted",
                  description: `Your ${props.appliance} usage will be shifted to ${props.timeWindow}.`,
                })}
                onDismiss={() => toast({
                  title: "Recommendation Dismissed",
                  description: "You can always find more recommendations in your energy profile.",
                })}
              />
            </div>
          );
        }
      } catch (e) {
        console.error("Failed to parse EnergyRecommendation props:", e);
      }
    }
    
    if (content.includes("data-component=\"GridFlexibilityRequest\"")) {
      try {
        const propsMatch = content.match(/data-props='(.+?)'/);
        if (propsMatch && propsMatch[1]) {
          const props = JSON.parse(propsMatch[1]);
          return (
            <div className="mt-4">
              <GridFlexibilityRequest 
                {...props}
                onAccept={() => toast({
                  title: "Request Accepted",
                  description: `Thank you for helping balance the grid!`,
                })}
                onDecline={() => toast({
                  title: "Request Declined",
                  description: "No problem. You'll receive future opportunities to help.",
                })}
              />
            </div>
          );
        }
      } catch (e) {
        console.error("Failed to parse GridFlexibilityRequest props:", e);
      }
    }
    
    if (content.includes("data-component=\"GridDemandResponse\"")) {
      try {
        const propsMatch = content.match(/data-props='(.+?)'/);
        if (propsMatch && propsMatch[1]) {
          const props = JSON.parse(propsMatch[1]);
          return (
            <div className="mt-4">
              <GridDemandResponse 
                {...props}
                onAccept={() => toast({
                  title: "Grid Response Accepted",
                  description: `Thank you for helping balance the grid!`,
                })}
                onDecline={() => toast({
                  title: "Grid Response Declined",
                  description: "No problem. You'll receive future opportunities to help.",
                })}
              />
            </div>
          );
        }
      } catch (e) {
        console.error("Failed to parse GridDemandResponse props:", e);
      }
    }
    
    if (content.includes("data-component=\"ScheduleOptimizationCard\"")) {
      try {
        const propsMatch = content.match(/data-props='(.+?)'/);
        if (propsMatch && propsMatch[1]) {
          const props = JSON.parse(propsMatch[1]);
          return (
            <div className="mt-4">
              <ScheduleOptimizationCard 
                {...props}
                onApply={() => toast({
                  title: "Optimization Applied",
                  description: "Your device schedule has been updated for optimal savings.",
                })}
                onDecline={() => toast({
                  title: "Optimization Declined",
                  description: "No problem. You can always optimize your schedule later.",
                })}
              />
            </div>
          );
        }
      } catch (e) {
        console.error("Failed to parse ScheduleOptimizationCard props:", e);
      }
    }
    
    if (content.includes("data-component=\"EnergySavingTipsCard\"")) {
      try {
        const propsMatch = content.match(/data-props='(.+?)'/);
        if (propsMatch && propsMatch[1]) {
          const props = JSON.parse(propsMatch[1]);
          return (
            <div className="mt-4">
              <EnergySavingTipsCard 
                {...props}
                onSaveTips={() => toast({
                  title: "Tips Saved",
                  description: "Energy saving tips have been saved to your profile.",
                })}
              />
            </div>
          );
        }
      } catch (e) {
        console.error("Failed to parse EnergySavingTipsCard props:", e);
      }
    }
    
    // Handle other component types
    if (content.includes("<UsageChart/>")) {
      return <UsageChart />;
    }
    
    if (content.includes("<SavingsReport/>")) {
      return <SavingsReport />;
    }
    
    if (content.includes("<UsagePatternInsight/>")) {
      return <UsagePatternDetail 
        patterns={transformedUsagePatterns}
        onOptimize={() => toast({
          title: "Optimization Requested",
          description: "Generating schedule optimization recommendations...",
        })}
      />;
    }
    
    if (content.includes("<EVRoutePlanner/>")) {
      return <EVRoutePlanner />;
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-gradient-to-b from-background to-background/50 rounded-lg border shadow-lg">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <div className="text-white">AI</div>
          </div>
          <div>
            <h2 className="font-bold text-lg">GridSense Assistant</h2>
            <p className="text-xs text-muted-foreground">AI Energy Coach & Advisor - Powered by Gemini</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id}
            message={message}
            onCopy={(content) => copyToClipboard(content)}
            customComponent={renderComponentFromContent(message.content)}
          />
        ))}
        
        {/* Show loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <div className="h-2 w-2 bg-primary rounded-full animation-delay-200"></div>
              <div className="h-2 w-2 bg-primary rounded-full animation-delay-400"></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Voice recording UI - shows when active */}
      {isListening && (
        <div className="p-6 flex flex-col items-center justify-center bg-black/5 border-t backdrop-blur-sm">
          <WaveformAnimation />
          <p className="mt-4 text-center font-medium">{transcript || "Listening..."}</p>
          <Button 
            variant="destructive"
            size="lg" 
            className="mt-4"
            onClick={toggleVoiceRecognition}
          >
            <MicOff className="mr-2 h-4 w-4" />
            Stop Listening
          </Button>
        </div>
      )}

      {/* Quick replies */}
      {!isListening && (
        <div className="flex flex-wrap gap-2 p-3 border-t">
          {quickReplies.map((reply) => (
            <QuickReplyButton 
              key={reply.id} 
              text={reply.text} 
              onClick={() => handleQuickReply(reply.text)} 
            />
          ))}
        </div>
      )}

      {/* Input area */}
      {!isListening && (
        <form onSubmit={handleInputSubmit} className="p-3 border-t flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleVoiceRecognition}
            className="flex-shrink-0"
          >
            <Mic className="h-5 w-5 text-accent" />
          </Button>
          
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message GridSense Assistant..."
            className="flex-1"
          />
          
          <Button
            type="submit"
            variant="default"
            size="icon"
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      )}
    </div>
  );
};
