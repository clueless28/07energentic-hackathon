
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demandResponseEvents } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Filter, Search, Users } from "lucide-react";
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

// Additional dummy data for past events
const pastEvents = [
  {
    id: "past-001",
    title: "Morning Peak Shaving",
    status: "completed",
    date: "2025-05-05",
    timeRange: "7:00 AM - 9:00 AM",
    incentive: "$0.60/kWh",
    earned: "$9.45",
    participation: "Full",
    impact: "2.1 kWh reduced",
  },
  {
    id: "past-002",
    title: "Solar Surplus Utilization",
    status: "completed",
    date: "2025-05-03",
    timeRange: "11:30 AM - 2:30 PM",
    incentive: "$0.35/kWh bonus",
    earned: "$4.20",
    participation: "Partial",
    impact: "3.5 kWh added",
  },
  {
    id: "past-003",
    title: "Evening Demand Response",
    status: "completed",
    date: "2025-05-01",
    timeRange: "6:00 PM - 8:00 PM",
    incentive: "$0.80/kWh",
    earned: "$12.80",
    participation: "Full",
    impact: "4.0 kWh reduced",
  },
];

// Dummy data for upcoming events (different from current events)
const futureEvents = [
  {
    id: "future-001",
    title: "Weekend Peak Management",
    status: "scheduled",
    date: "2025-05-15",
    timeRange: "1:00 PM - 5:00 PM",
    incentive: "$0.65/kWh",
    potentialEarnings: "$10-18",
    participants: 782,
    eligibility: "All devices",
  },
  {
    id: "future-002",
    title: "Grid Maintenance Support",
    status: "scheduled",
    date: "2025-05-20",
    timeRange: "9:00 AM - 12:00 PM",
    incentive: "$0.55/kWh",
    potentialEarnings: "$8-15",
    participants: 503,
    eligibility: "All devices except EV",
  },
];

const Events = () => {
  const { toast } = useToast();
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold gradient-heading">Demand Response Events</h1>
            <p className="text-muted-foreground">Participate in events to earn rewards and support grid stability</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" /> Calendar View
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search events..." 
              className="w-full pl-9 py-2 pr-4 border rounded-md bg-background"
            />
          </div>
        </div>
        
        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="current">Current Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
            {demandResponseEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date} • {event.timeRange}
                      </p>
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
                          <Clock className="h-3 w-3" /> Live Now
                        </span>
                      ) : (
                        "Upcoming"
                      )}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Incentive Rate</p>
                      <p className="font-medium">{event.incentive}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Potential Earnings</p>
                      <p className="font-medium">{event.potentialEarnings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Target Reduction</p>
                      <p className="font-medium">{event.targetReduction}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm">{event.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {event.participants} households participating
                      </span>
                    </div>
                    <Button 
                      onClick={() => toast({
                        title: "Participation Request",
                        description: "See the Events tab on the Dashboard to participate"
                      })}
                    >
                      Join Event
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            {futureEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date} • {event.timeRange}
                      </p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Incentive Rate</p>
                      <p className="font-medium">{event.incentive}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Potential Earnings</p>
                      <p className="font-medium">{event.potentialEarnings}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Eligible Devices</p>
                      <p className="font-medium">{event.eligibility}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {event.participants} households interested
                      </span>
                    </div>
                    <Button variant="outline">
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date} • {event.timeRange}
                      </p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20 border-green-200">
                      Completed
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Rate</p>
                      <p className="font-medium">{event.incentive}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Earned</p>
                      <p className="font-medium text-green-600">{event.earned}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Impact</p>
                      <p className="font-medium">{event.impact}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Events;
