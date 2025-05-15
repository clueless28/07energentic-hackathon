
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userDevices } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy data for device history
const deviceHistoryData = {
  'dev-001': [
    { date: '2025-05-09', time: '14:30', consumption: '1.3 kWh', mode: 'Cooling', temp: '72°F' },
    { date: '2025-05-09', time: '12:15', consumption: '1.2 kWh', mode: 'Cooling', temp: '73°F' },
    { date: '2025-05-09', time: '10:00', consumption: '1.1 kWh', mode: 'Cooling', temp: '74°F' },
    { date: '2025-05-08', time: '20:30', consumption: '1.4 kWh', mode: 'Cooling', temp: '71°F' },
    { date: '2025-05-08', time: '18:15', consumption: '1.5 kWh', mode: 'Cooling', temp: '70°F' },
  ],
  'dev-002': [
    { date: '2025-05-09', time: '13:45', consumption: '7.2 kWh', chargeLevel: '80%', chargingRate: '7.4 kW' },
    { date: '2025-05-08', time: '22:30', consumption: '10.5 kWh', chargeLevel: '60%', chargingRate: '7.4 kW' },
    { date: '2025-05-07', time: '23:15', consumption: '15.8 kWh', chargeLevel: '30%', chargingRate: '11.0 kW' },
    { date: '2025-05-05', time: '22:00', consumption: '18.3 kWh', chargeLevel: '20%', chargingRate: '11.0 kW' },
  ],
  'dev-003': [
    { date: '2025-05-09', time: '15:00', consumption: '0.7 kWh', temp: '135°F', mode: 'Eco' },
    { date: '2025-05-09', time: '08:30', consumption: '0.9 kWh', temp: '140°F', mode: 'Standard' },
    { date: '2025-05-08', time: '19:45', consumption: '0.8 kWh', temp: '135°F', mode: 'Eco' },
    { date: '2025-05-08', time: '07:15', consumption: '1.1 kWh', temp: '145°F', mode: 'Standard' },
  ]
};

// Dummy data for device configuration
const deviceConfigData = {
  'dev-001': { 
    name: 'Living Room HVAC', 
    minTemp: '68°F', 
    maxTemp: '78°F', 
    autoAdjust: true,
    priority: 'Medium',
    participateInEvents: true
  },
  'dev-002': { 
    name: 'Tesla Model Y',
    minChargeLevel: '50%',
    preferredChargingTime: '10:00 PM - 6:00 AM',
    fastChargingAllowed: false,
    priority: 'Low',
    participateInEvents: true
  },
  'dev-003': { 
    name: 'Water Heater',
    minTemp: '120°F',
    maxTemp: '140°F',
    autoAdjust: true,
    priority: 'High',
    participateInEvents: true
  }
};

// Dummy data for device schedule optimization
const deviceScheduleData = {
  'dev-001': [
    { time: '8:00 AM - 10:00 AM', action: 'Pre-cool', saving: '15%', reason: 'Morning peak avoidance' },
    { time: '2:00 PM - 4:00 PM', action: 'Temperature increase', saving: '20%', reason: 'Afternoon peak pricing' },
    { time: '7:00 PM - 9:00 PM', action: 'Standard operation', saving: '0%', reason: 'Home occupied' },
  ],
  'dev-002': [
    { time: '9:00 PM - 6:00 AM', action: 'Slow charge', saving: '40%', reason: 'Off-peak electricity rates' },
    { time: '2:00 PM - 4:00 PM', action: 'Solar charging', saving: '100%', reason: 'Excess solar production' },
  ],
  'dev-003': [
    { time: '5:00 AM - 7:00 AM', action: 'Pre-heat', saving: '25%', reason: 'Before morning usage' },
    { time: '1:00 PM - 3:00 PM', action: 'Maintain temperature', saving: '10%', reason: 'Solar utilization' },
    { time: '8:00 PM - 10:00 PM', action: 'Pre-heat', saving: '30%', reason: 'Before evening usage, off-peak rates' },
  ]
};

export const DeviceList = () => {
  const [devices, setDevices] = useState(userDevices);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<any>(null);
  const [currentAction, setCurrentAction] = useState('');

  const handleDeviceAction = (deviceId: string, action: string) => {
    setCurrentDevice(devices.find(d => d.id === deviceId));
    setCurrentAction(action);
    setDialogOpen(true);
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Connected Devices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center 
                  ${device.type === 'HVAC' ? 'bg-blue-100 text-blue-600' : 
                   device.type === 'EV Charger' ? 'bg-green-100 text-green-600' : 
                   'bg-orange-100 text-orange-600'}`}
                >
                  {device.type === 'HVAC' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
                  ) : device.type === 'EV Charger' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M14 16h-4v-2h4m0-8h-4v5h4"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.48 17.72A8 8 0 1 0 5.999 18c.641.087 1.3.087 1.95 0M7 21v-4m5-4v-8m5 8.5V5"/></svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{device.name}</p>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-green-500/20 text-green-700 hover:bg-green-500/20 border-green-200"
                    >
                      Connected
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Currently using {device.currentUsage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-green-600 font-medium">
                  {device.savingPotential} saving potential
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDeviceAction(device.id, "Configure")}>
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeviceAction(device.id, "View History")}>
                      View History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeviceAction(device.id, "Optimize Schedule")}>
                      Optimize Schedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* Device Action Dialog */}
      {currentDevice && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{currentAction} - {currentDevice.name}</DialogTitle>
              <DialogDescription>
                {currentAction === "Configure" 
                  ? "Manage your device settings and preferences" 
                  : currentAction === "View History" 
                  ? "View energy usage history for this device" 
                  : "View and adjust optimized schedule for energy savings"}
              </DialogDescription>
            </DialogHeader>
            
            {currentAction === "Configure" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(deviceConfigData[currentDevice.id] || {}).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <div className="p-2 border rounded-md text-sm">
                        {typeof value === 'boolean' 
                          ? value ? 'Enabled' : 'Disabled' 
                          : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Configuration Saved",
                        description: `Settings for ${currentDevice.name} have been updated`
                      });
                      setDialogOpen(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </div>
            )}
            
            {currentAction === "View History" && (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Consumption</TableHead>
                      {currentDevice.type === 'EV Charger' ? (
                        <>
                          <TableHead>Charge Level</TableHead>
                          <TableHead>Charge Rate</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead>Temperature</TableHead>
                          <TableHead>Mode</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(deviceHistoryData[currentDevice.id] || []).map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.time}</TableCell>
                        <TableCell>{record.consumption}</TableCell>
                        {currentDevice.type === 'EV Charger' ? (
                          <>
                            <TableCell>{record.chargeLevel}</TableCell>
                            <TableCell>{record.chargingRate}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{record.temp}</TableCell>
                            <TableCell>{record.mode}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
            
            {currentAction === "Optimize Schedule" && (
              <div className="space-y-4">
                <div className="border rounded-md divide-y">
                  {(deviceScheduleData[currentDevice.id] || []).map((schedule, index) => (
                    <div key={index} className="p-3">
                      <div className="flex justify-between">
                        <div className="font-medium">{schedule.time}</div>
                        <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/20 border-green-200">
                          {schedule.saving} savings
                        </Badge>
                      </div>
                      <div className="text-sm mt-1">{schedule.action}</div>
                      <div className="text-xs text-muted-foreground mt-1">Reason: {schedule.reason}</div>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Schedule Optimized",
                        description: `Your ${currentDevice.name} schedule has been optimized for maximum savings`
                      });
                      setDialogOpen(false);
                    }}
                  >
                    Apply Optimized Schedule
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};
