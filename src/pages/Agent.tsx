
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Brain, 
  Check, 
  Clock, 
  History, 
  Loader2, 
  Settings,
  Sliders
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

// Dummy data for AI agent actions
const agentActions = [
  { 
    id: "action-001", 
    timestamp: "15:32:18", 
    action: "HVAC Pre-cooling", 
    reason: "Preparing for demand response event at 4:00 PM",
    status: "completed",
    devices: ["Living Room HVAC"]
  },
  { 
    id: "action-002", 
    timestamp: "14:51:03", 
    action: "Bid Placement", 
    reason: "Placed successful bid for Grid Stability Support event",
    status: "completed",
    value: "$0.50/kWh"
  },
  { 
    id: "action-003", 
    timestamp: "13:45:22", 
    action: "Water Heater Schedule", 
    reason: "Pre-heated water to avoid peak electricity rates",
    status: "completed",
    devices: ["Water Heater"]
  },
  { 
    id: "action-004", 
    timestamp: "11:22:15", 
    action: "EV Charging Delay", 
    reason: "Scheduled charging for off-peak hours (9:00 PM)",
    status: "scheduled",
    devices: ["Tesla Model Y"]
  }
];

// Dummy data for agent analytics
const agentAnalytics = {
  savingsMonth: "$42.80",
  savingsYear: "$328.45",
  eventParticipation: "85%",
  decisionAccuracy: "92%",
  optimizationScore: "87%",
  carbonReduction: "128kg",
  learningProgress: 74
};

// Dummy data for agent alerts
const agentAlerts = [
  {
    id: "alert-001",
    timestamp: "2025-05-09 08:45",
    severity: "info",
    message: "Detected new demand response program available through GridShare"
  },
  {
    id: "alert-002",
    timestamp: "2025-05-08 17:20",
    severity: "warning",
    message: "HVAC efficiency decreased by 8%, potential maintenance needed"
  },
  {
    id: "alert-003",
    timestamp: "2025-05-07 13:10",
    severity: "info",
    message: "Identified new pattern to improve EV charging schedule"
  }
];

// Dummy data for agent settings
const agentSettings = {
  optimizationPriority: 65, // 0-100 scale, higher means more savings vs comfort
  autoBiddingEnabled: true,
  maxAutoParticipation: "$25.00",
  privacyMode: "balanced",
  dataSharing: "anonymous",
  learningRate: "adaptive",
  deviceControl: {
    HVAC: "full",
    waterHeater: "full",
    evCharger: "scheduling-only"
  }
};

const Agent = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold gradient-heading">Your AI Agent</h1>
            <p className="text-muted-foreground">
              GridSense AI optimizes your energy usage and market participation
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-200 flex items-center gap-1 px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Active
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Agent Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-semibold text-gridsense-600">Active</div>
                    <div className="text-sm text-muted-foreground">Online for 12 days</div>
                  </div>
                  
                  <div className="space-y-4 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Brain className="h-4 w-4 text-gridsense-600" />
                        <span>Learning Progress</span>
                      </div>
                      <span>{agentAnalytics.learningProgress}%</span>
                    </div>
                    <Progress value={agentAnalytics.learningProgress} className="h-2" />
                    
                    <div className="p-3 rounded-md bg-muted/50">
                      <div className="flex items-center gap-1 mb-1 font-medium text-sm">
                        <Activity className="h-4 w-4 text-gridsense-600" />
                        <span>Current Focus</span>
                      </div>
                      <p className="text-sm">
                        Optimizing for Grid Stability Support event at 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-1">
                    <History className="h-4 w-4" />
                    History
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-base font-medium">Performance</CardTitle>
                <Button variant="outline" size="sm" className="h-7">
                  <BarChart3 className="h-4 w-4 mr-1" /> Detailed Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-md bg-muted/50">
                  <div className="text-xs text-muted-foreground">Monthly Savings</div>
                  <div className="text-xl font-semibold text-green-600">{agentAnalytics.savingsMonth}</div>
                  <div className="text-xs text-muted-foreground">
                    YTD: {agentAnalytics.savingsYear}
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted/50">
                  <div className="text-xs text-muted-foreground">Optimization Score</div>
                  <div className="text-xl font-semibold text-gridsense-600">{agentAnalytics.optimizationScore}</div>
                  <div className="text-xs text-green-600">
                    <Check className="h-3 w-3 inline" /> Above average
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted/50">
                  <div className="text-xs text-muted-foreground">Carbon Reduction</div>
                  <div className="text-xl font-semibold">{agentAnalytics.carbonReduction}</div>
                  <div className="text-xs text-green-600">
                    <Check className="h-3 w-3 inline" /> 12% improvement
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted/50">
                  <div className="text-xs text-muted-foreground">Event Participation</div>
                  <div className="text-xl font-semibold">{agentAnalytics.eventParticipation}</div>
                  <div className="text-xs text-muted-foreground">
                    12 events this month
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted/50">
                  <div className="text-xs text-muted-foreground">Decision Accuracy</div>
                  <div className="text-xl font-semibold">{agentAnalytics.decisionAccuracy}</div>
                  <div className="text-xs text-green-600">
                    <Check className="h-3 w-3 inline" /> Highly reliable
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted/50">
                  <div className="text-xs text-muted-foreground">Comfort Balance</div>
                  <div className="text-xl font-semibold">92%</div>
                  <div className="text-xs text-muted-foreground">
                    3 comfort overrides
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">Agent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {agentActions.map(action => (
                    <div key={action.id} className="flex gap-4">
                      <div className="w-8 text-xs text-muted-foreground text-right">
                        {action.timestamp}
                      </div>
                      
                      <div className="relative">
                        <div className={`w-2.5 h-2.5 rounded-full z-10 relative ${
                          action.status === "completed" ? "bg-green-500" : "bg-blue-500"
                        }`}></div>
                        <div className="absolute w-0.5 bg-muted-foreground/30 top-3 bottom-0 left-1"></div>
                      </div>
                      
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between">
                          <div className="font-medium">{action.action}</div>
                          {action.status === "completed" ? (
                            <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-200">
                              <Check className="h-3 w-3 mr-1" /> Complete
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-700 border-blue-200">
                              <Clock className="h-3 w-3 mr-1" /> Scheduled
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1">
                          {action.reason}
                        </p>
                        
                        <div className="mt-2 flex flex-wrap gap-1">
                          {action.devices?.map(device => (
                            <Badge key={device} variant="outline" className="text-xs">
                              {device}
                            </Badge>
                          ))}
                          {action.value && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Value: {action.value}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Agent Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="preferences">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preferences" className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Optimization Priority</label>
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="h-2 flex-1 rounded-full bg-muted/80 relative">
                        <div 
                          className="absolute h-3 w-3 bg-gridsense-600 rounded-full top-1/2 -translate-y-1/2 shadow-sm"
                          style={{ left: `${agentSettings.optimizationPriority}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Comfort</span>
                      <span>Balanced</span>
                      <span>Savings</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Automatic Bidding</label>
                      <div className={`w-8 h-4 rounded-full relative ${agentSettings.autoBiddingEnabled ? 'bg-green-500' : 'bg-muted'}`}>
                        <div className={`absolute h-3 w-3 bg-white rounded-full top-1/2 -translate-y-1/2 shadow-sm ${
                          agentSettings.autoBiddingEnabled ? 'right-0.5' : 'left-0.5'
                        }`}></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-1">
                        <span className="text-sm font-medium">Max Auto-Bid</span>
                        <span className="text-xs text-muted-foreground">(per event)</span>
                      </label>
                      <div className="font-medium">
                        {agentSettings.maxAutoParticipation}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Privacy Mode</label>
                      <Badge variant="outline">
                        {agentSettings.privacyMode}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Device Control</h4>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 border rounded-md text-center">
                        <div className="text-xs text-muted-foreground mb-1">HVAC</div>
                        <Badge variant="outline" className="bg-green-500/10 border-green-200 text-green-700">
                          {agentSettings.deviceControl.HVAC}
                        </Badge>
                      </div>
                      
                      <div className="p-2 border rounded-md text-center">
                        <div className="text-xs text-muted-foreground mb-1">Water</div>
                        <Badge variant="outline" className="bg-green-500/10 border-green-200 text-green-700">
                          {agentSettings.deviceControl.waterHeater}
                        </Badge>
                      </div>
                      
                      <div className="p-2 border rounded-md text-center">
                        <div className="text-xs text-muted-foreground mb-1">EV</div>
                        <Badge variant="outline" className="bg-blue-500/10 border-blue-200 text-blue-700">
                          scheduling
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <Sliders className="h-4 w-4 mr-1" />
                    Advanced Settings
                  </Button>
                </TabsContent>
                
                <TabsContent value="alerts" className="p-4 space-y-4">
                  <ScrollArea className="h-[240px]">
                    <div className="space-y-3">
                      {agentAlerts.map(alert => (
                        <div key={alert.id} className="p-3 border rounded-md">
                          <div className="flex items-start gap-3">
                            <div className={`rounded-full p-1 ${
                              alert.severity === 'warning' 
                                ? 'bg-yellow-100 text-yellow-600' 
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              {alert.severity === 'warning' 
                                ? <AlertTriangle className="h-4 w-4" /> 
                                : <Loader2 className="h-4 w-4" />
                              }
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div className="font-medium text-sm">
                                  {alert.message}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {alert.timestamp}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Agent;
