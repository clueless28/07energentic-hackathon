
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define interfaces for activity logs
interface BaseActivityLog {
  id: string;
  timestamp: string;
  event: string;
  description: string;
}

interface DeviceActivityLog extends BaseActivityLog {
  deviceType: string;
  impact?: string;
}

interface BidActivityLog extends BaseActivityLog {
  value: string;
  result: string;
}

interface LoadPredictionLog extends BaseActivityLog {
  prediction: string;
}

interface EventDiscoveryLog extends BaseActivityLog {
  foundEvents: number;
}

interface DailySummaryLog extends BaseActivityLog {
  consumption: string;
  savings: string;
}

interface EventPlanningLog extends BaseActivityLog {
  eventType: string;
  eventDate: string;
}

// Union type for all activity log variations
type ActivityLog = 
  | DeviceActivityLog 
  | BidActivityLog 
  | LoadPredictionLog 
  | EventDiscoveryLog 
  | DailySummaryLog
  | EventPlanningLog;

// Dummy data for AI agent activity logs
const initialActivityLogs: ActivityLog[] = [
  { 
    id: 'log-001', 
    timestamp: '2025-05-09 15:32:18', 
    event: 'Device Action', 
    description: 'Pre-cooled home by 2°F ahead of peak event',
    deviceType: 'HVAC',
    impact: 'Savings: $0.82'
  },
  { 
    id: 'log-002', 
    timestamp: '2025-05-09 14:51:03', 
    event: 'Bid Placement', 
    description: 'Placed automated bid for Grid Stability Support event',
    value: '$0.50/kWh',
    result: 'Accepted'
  },
  { 
    id: 'log-003', 
    timestamp: '2025-05-09 13:45:22', 
    event: 'Schedule Optimization', 
    description: 'Rescheduled water heating to off-peak hours',
    deviceType: 'Water Heater',
    impact: 'Savings: $1.35'
  },
  { 
    id: 'log-004', 
    timestamp: '2025-05-09 11:22:15', 
    event: 'EV Charging', 
    description: 'Delayed EV charging to 9:00 PM based on rate analysis',
    deviceType: 'EV Charger',
    impact: 'Savings: $3.20'
  },
  { 
    id: 'log-005', 
    timestamp: '2025-05-09 09:10:42', 
    event: 'Load Prediction', 
    description: 'Updated daily load forecast based on weather prediction',
    prediction: '18.4 kWh expected consumption'
  },
  { 
    id: 'log-006', 
    timestamp: '2025-05-09 08:05:30', 
    event: 'Event Discovery', 
    description: 'Discovered upcoming demand response events via Beckn API',
    foundEvents: 3
  },
  { 
    id: 'log-007', 
    timestamp: '2025-05-09 00:15:00', 
    event: 'Daily Summary', 
    description: 'Generated end-of-day energy usage report',
    consumption: '14.8 kWh',
    savings: '$4.25'
  }
];

interface Task {
  id: string;
  type: string;
  description: string;
  inProgress: boolean;
  details?: any;
}

export const AIAgent = () => {
  const { toast } = useToast();
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Listen for new AI agent tasks
  useEffect(() => {
    const handleNewTask = (event: CustomEvent) => {
      const { taskId, taskType, description, details } = event.detail;
      
      // Add new task
      setTasks(prevTasks => [
        ...prevTasks,
        {
          id: taskId,
          type: taskType,
          description,
          inProgress: true,
          details
        }
      ]);
      
      // Add to activity logs
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
      const dateString = now.toLocaleDateString('en-US');
      
      // Create a properly typed event planning log
      const newEventLog: EventPlanningLog = {
        id: `log-${Date.now()}`,
        timestamp: `${dateString} ${timeString}`,
        event: 'New Event Planning',
        description: description,
        eventType: details?.eventType || 'custom',
        eventDate: details?.eventDate || 'upcoming'
      };
      
      setActivityLogs(prevLogs => [
        newEventLog,
        ...prevLogs
      ]);
      
      // Show toast notification
      toast({
        title: "New AI Task",
        description: description
      });
    };
    
    window.addEventListener('ai:agent:new-task', handleNewTask as EventListener);
    
    return () => {
      window.removeEventListener('ai:agent:new-task', handleNewTask as EventListener);
    };
  }, [toast]);

  // Function to check if log has eventType property (type guard)
  const isEventPlanningLog = (log: ActivityLog): log is EventPlanningLog => {
    return 'eventType' in log;
  };

  // Function to check if log has deviceType property (type guard)
  const isDeviceActivityLog = (log: ActivityLog): log is DeviceActivityLog => {
    return 'deviceType' in log;
  };

  // Function to check if log has value property (type guard)
  const isBidActivityLog = (log: ActivityLog): log is BidActivityLog => {
    return 'value' in log;
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">AI Agent Status</CardTitle>
          <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-200">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="activity">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="p-4 space-y-4">
            <div className="rounded-md bg-muted/50 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Current Tasks</div>
                <Badge variant="outline" className="text-xs">In Progress</Badge>
              </div>
              
              {tasks.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {tasks.map(task => (
                    <div key={task.id} className="text-xs border-l-2 border-blue-400 pl-2 py-1">
                      <div className="font-medium">{task.description}</div>
                      {task.details?.affectedLocations && (
                        <div className="text-muted-foreground">
                          Locations: {task.details.affectedLocations.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Preparing for Grid Stability Support event at 4:00 PM
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>EV charging scheduled for 9:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Water heater pre-heated until 3:45 PM</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>HVAC optimized for demand response</span>
              </div>
            </div>
            
            <button 
              className="w-full py-1.5 px-2 text-xs text-center bg-gridsense-50 text-gridsense-600 rounded-md hover:bg-gridsense-100"
              onClick={() => setShowActivityLog(true)}
            >
              View full activity log
            </button>
          </TabsContent>
          
          <TabsContent value="preferences" className="p-4 space-y-4">
            <div>
              <label className="text-xs font-medium">Optimization Priority</label>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-2 flex-1 rounded-full bg-gridsense-100 relative">
                  <div className="absolute h-3 w-3 bg-gridsense-600 rounded-full top-1/2 -translate-y-1/2 left-[70%] shadow-sm"></div>
                </div>
                <span className="text-xs text-muted-foreground">Savings</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Comfort</span>
                <span>Balanced</span>
                <span>Savings</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium">Automatic Bidding</label>
                <div className="w-8 h-4 rounded-full bg-green-500 relative">
                  <div className="absolute h-3 w-3 bg-white rounded-full top-1/2 -translate-y-1/2 right-0.5 shadow-sm"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium">Device Control</label>
                <div className="w-8 h-4 rounded-full bg-green-500 relative">
                  <div className="absolute h-3 w-3 bg-white rounded-full top-1/2 -translate-y-1/2 right-0.5 shadow-sm"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium">Smart Recommendations</label>
                <div className="w-8 h-4 rounded-full bg-green-500 relative">
                  <div className="absolute h-3 w-3 bg-white rounded-full top-1/2 -translate-y-1/2 right-0.5 shadow-sm"></div>
                </div>
              </div>
            </div>
            
            <button 
              className="w-full py-1.5 px-2 text-xs text-center bg-gridsense-50 text-gridsense-600 rounded-md hover:bg-gridsense-100"
              onClick={() => toast({
                title: "AI Preferences",
                description: "Advanced AI preferences will be available soon"
              })}
            >
              Advanced preferences
            </button>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Activity Log Dialog */}
      <Dialog open={showActivityLog} onOpenChange={setShowActivityLog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Agent Activity Log</DialogTitle>
            <DialogDescription>
              Detailed history of your AI agent's actions and decisions
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {activityLogs.map(log => (
                <div key={log.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-sm">{log.event}</div>
                    <div className="text-xs text-muted-foreground">{log.timestamp}</div>
                  </div>
                  <p className="text-sm">{log.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {isDeviceActivityLog(log) && log.deviceType && (
                      <Badge variant="outline" className="text-xs">
                        {log.deviceType}
                      </Badge>
                    )}
                    {isDeviceActivityLog(log) && log.impact && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200 text-xs">
                        {log.impact}
                      </Badge>
                    )}
                    {isBidActivityLog(log) && log.value && (
                      <Badge variant="outline" className="text-xs">
                        Bid: {log.value}
                      </Badge>
                    )}
                    {isEventPlanningLog(log) && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200 text-xs">
                        {log.eventType}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
