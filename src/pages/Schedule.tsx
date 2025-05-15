
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Settings } from "lucide-react";
import { useState } from "react";

// Dummy schedule data
const scheduleEvents = [
  {
    id: "sched-001",
    title: "Peak Demand Reduction",
    type: "demand-response",
    date: "2025-05-09",
    startTime: "16:00",
    endTime: "19:00",
    devices: ["HVAC", "Water Heater"],
    earnings: "$8-15",
    status: "confirmed"
  },
  {
    id: "sched-002",
    title: "EV Charging",
    type: "device-operation",
    date: "2025-05-09",
    startTime: "21:00",
    endTime: "06:00",
    devices: ["EV Charger"],
    status: "scheduled"
  },
  {
    id: "sched-003",
    title: "Water Heating",
    type: "device-operation",
    date: "2025-05-10",
    startTime: "05:00",
    endTime: "07:00",
    devices: ["Water Heater"],
    status: "scheduled"
  },
  {
    id: "sched-004",
    title: "Renewable Surplus Utilization",
    type: "demand-response",
    date: "2025-05-12",
    startTime: "11:00",
    endTime: "15:00",
    devices: ["HVAC", "Water Heater", "EV Charger"],
    earnings: "$5-12",
    status: "pending"
  }
];

// Generate days for calendar view
const generateCalendarDays = () => {
  const days = [];
  const today = new Date("2025-05-09");
  
  for (let i = -2; i < 12; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayEvents = scheduleEvents.filter(event => 
      event.date === date.toISOString().split('T')[0]
    );
    
    days.push({
      date,
      dayOfMonth: date.getDate(),
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: i === 0,
      events: dayEvents
    });
  }
  
  return days;
};

const Schedule = () => {
  const [calendarDays] = useState(generateCalendarDays());
  const today = calendarDays.find(day => day.isToday);
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold gradient-heading">Energy Schedule</h1>
            <p className="text-muted-foreground">Optimize your energy usage and participation</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-1" /> Month View
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" /> Preferences
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="py-3 px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-base font-medium">May 2025</h3>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="h-7">Today</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex overflow-x-auto pb-2">
              {calendarDays.map((day) => (
                <div key={day.date.toString()} className={`min-w-[120px] border-r last:border-r-0 p-3 ${
                  day.isToday ? 'bg-primary/5' : ''
                }`}>
                  <div className="flex flex-col items-center mb-2">
                    <div className="text-xs text-muted-foreground">{day.dayOfWeek}</div>
                    <div className={`text-lg font-medium ${
                      day.isToday ? 'h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center' : ''
                    }`}>
                      {day.dayOfMonth}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {day.events.map(event => (
                      <div 
                        key={event.id} 
                        className={`p-1.5 rounded text-xs ${
                          event.type === 'demand-response' 
                            ? 'bg-blue-500/15 text-blue-700 border border-blue-200' 
                            : 'bg-purple-500/15 text-purple-700 border border-purple-200'
                        }`}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {event.startTime.replace(':00', '')} - {event.endTime.replace(':00', '')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Today's Schedule - {today?.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {today?.events.length ? (
                today.events.map(event => (
                  <div key={event.id} className="flex p-3 border rounded-md">
                    <div className="w-[60px] text-center border-r pr-2">
                      <div className="text-sm font-medium">{event.startTime}</div>
                      <div className="text-xs text-muted-foreground">to</div>
                      <div className="text-sm font-medium">{event.endTime}</div>
                    </div>
                    
                    <div className="flex-1 px-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Devices: {event.devices.join(', ')}
                          </p>
                        </div>
                        <div>
                          {event.type === 'demand-response' && (
                            <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/20 border-blue-200">
                              Grid Event
                            </Badge>
                          )}
                          {event.type === 'device-operation' && (
                            <Badge className="bg-purple-500/20 text-purple-700 hover:bg-purple-500/20 border-purple-200">
                              Device
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-2 pt-2 border-t">
                        <div>
                          {event.earnings && (
                            <span className="text-sm text-green-600">
                              Potential earnings: {event.earnings}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-7">Edit</Button>
                          {event.status === 'confirmed' && (
                            <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-200">
                              Confirmed
                            </Badge>
                          )}
                          {event.status === 'pending' && (
                            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-200">
                              Pending
                            </Badge>
                          )}
                          {event.status === 'scheduled' && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-700 border-blue-200">
                              Scheduled
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No events scheduled for today
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
