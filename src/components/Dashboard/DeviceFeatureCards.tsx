
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AirVent, Fan, Heater, Lightbulb, Tv, Battery, Refrigerator, Power, Monitor, Gauge } from "lucide-react";

// Define types for device data
interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  baseKWh: number;
  isActive: boolean;
  icon: keyof typeof deviceIcons;
  participatingInEvent?: boolean;
  eventId?: string;
}

// Mapping of device types to icons
const deviceIcons = {
  airConditioner: AirVent,
  fan: Fan,
  geyser: Heater,
  laptop: Monitor,
  led: Lightbulb,
  microwave: Heater, // Using heater as a substitute for microwave
  refrigerator: Refrigerator,
  heater: Heater,
  solar: Battery,
  tv: Tv,
  evCharger: Battery // Using battery icon for EV Charger
};

// Initial devices data with location information
const initialDevices: Device[] = [
  { id: "dev-101", name: "Air Conditioner", type: "HVAC", location: "Living Room", rating: 1500, baseKWh: 0.025, isActive: true, icon: "airConditioner" },
  { id: "dev-102", name: "Ceiling Fan", type: "Fan", location: "Living Room", rating: 75, baseKWh: 0.00125, isActive: true, icon: "fan" },
  { id: "dev-103", name: "Electric Geyser", type: "Water Heater", location: "Bathroom", rating: 3000, baseKWh: 0.05, isActive: false, icon: "geyser" },
  { id: "dev-104", name: "Laptop Charger", type: "Electronics", location: "Bedroom", rating: 65, baseKWh: 0.00108, isActive: true, icon: "laptop" },
  { id: "dev-105", name: "LED Bulb (10W)", type: "Lighting", location: "Bedroom", rating: 10, baseKWh: 0.00017, isActive: true, icon: "led" },
  { id: "dev-106", name: "Microwave Oven", type: "Appliance", location: "Kitchen", rating: 1000, baseKWh: 0.01667, isActive: false, icon: "microwave" },
  { id: "dev-107", name: "Refrigerator", type: "Appliance", location: "Kitchen", rating: 200, baseKWh: 0.00333, isActive: true, icon: "refrigerator" },
  { id: "dev-108", name: "Room Heater", type: "HVAC", location: "Bedroom", rating: 2000, baseKWh: 0.03333, isActive: false, icon: "heater" },
  { id: "dev-109", name: "Solar Panel", type: "Generation", location: "Roof", rating: 1200, baseKWh: 0.02, isActive: true, icon: "solar" },
  { id: "dev-110", name: "Television (LED)", type: "Electronics", location: "Living Room", rating: 120, baseKWh: 0.002, isActive: true, icon: "tv" },
  { id: "dev-111", name: "Tesla Model Y", type: "EV Charger", location: "Garage", rating: 7400, baseKWh: 0.12333, isActive: false, icon: "evCharger" }
];

export const DeviceFeatureCards = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [locations, setLocations] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Extract unique locations and sort devices by location
  useEffect(() => {
    const uniqueLocations = Array.from(new Set(devices.map(device => device.location)));
    setLocations(uniqueLocations);
  }, [devices]);
  
  // Listen for grid event participation events
  useEffect(() => {
    const handleEventParticipation = (event: CustomEvent) => {
      const { eventId, affectedDeviceTypes, active, locations } = event.detail;
      
      setDevices(prevDevices => 
        prevDevices.map(device => {
          // Check if this device type is affected by the event and is in the affected location
          const isAffected = (
            (affectedDeviceTypes.some(type => 
              device.type.toLowerCase().includes(type) || 
              device.name.toLowerCase().includes(type)
            )) &&
            (!locations || locations.includes(device.location))
          );
          
          if (isAffected && device.type !== "Generation") {
            return { 
              ...device, 
              participatingInEvent: active,
              eventId: eventId
            };
          }
          return device;
        })
      );
      
      // Notify user about affected devices
      const affectedDevices = devices.filter(d => 
        affectedDeviceTypes.some(type => 
          d.type.toLowerCase().includes(type) || 
          d.name.toLowerCase().includes(type)
        ) && (!locations || locations.includes(d.location))
      );
      
      if (affectedDevices.length > 0) {
        const locationStr = locations?.length ? ` in ${locations.join(', ')}` : '';
        toast({
          title: `${affectedDevices.length} devices affected by event`,
          description: `Devices${locationStr} will be managed by the AI agent during the event`
        });
      }
    };
    
    window.addEventListener('grid:event:participation', handleEventParticipation as EventListener);
    
    return () => {
      window.removeEventListener('grid:event:participation', handleEventParticipation as EventListener);
    };
  }, [toast, devices]);
  
  // Function to toggle device status
  const toggleDeviceStatus = (id: string) => {
    setDevices(prevDevices => 
      prevDevices.map(device => {
        if (device.id === id) {
          // If device is participating in event, don't allow manual toggle
          if (device.participatingInEvent) {
            toast({
              title: `${device.name} is currently managed by AI`,
              description: "This device is participating in a grid event and can't be manually controlled right now"
            });
            return device;
          }
          return { ...device, isActive: !device.isActive };
        }
        return device;
      })
    );
    
    const device = devices.find(d => d.id === id);
    if (device && !device.participatingInEvent) {
      toast({
        title: `${device.name} ${!device.isActive ? 'activated' : 'deactivated'}`,
        description: `The device has been ${!device.isActive ? 'turned on' : 'turned off'}`
      });
    }
  };
  
  // Calculate total active consumption
  const totalActiveConsumption = devices
    .filter(device => device.isActive && device.type !== "Generation")
    .reduce((sum, device) => sum + device.baseKWh, 0);
    
  // Calculate total generation
  const totalGeneration = devices
    .filter(device => device.isActive && device.type === "Generation")
    .reduce((sum, device) => sum + device.baseKWh, 0);
    
  // Net consumption (consumption - generation)
  const netConsumption = totalActiveConsumption - totalGeneration;

  // Determine the styling class based on consumption value
  const getConsumptionStyling = (value: number) => {
    if (value <= 0) return "text-green-500"; // Negative or zero (producing more than consuming)
    if (value < 0.01) return "text-blue-500"; // Low consumption
    if (value < 0.03) return "text-yellow-500"; // Medium consumption
    return "text-red-500"; // High consumption
  };

  const consumptionTextColor = getConsumptionStyling(netConsumption);

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">Household Devices</CardTitle>
          <div className="mt-2 flex items-center">
            <div className="mr-2 text-sm text-muted-foreground">Current net consumption:</div>
            <div className={`flex items-center justify-center px-3 py-1 rounded-full bg-[#F1F0FB] border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700`}>
              <Gauge className={`h-4 w-4 mr-1.5 ${consumptionTextColor}`} />
              <span className={`text-sm font-semibold ${consumptionTextColor}`}>
                {netConsumption.toFixed(5)} kWh per minute
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
            {devices.filter(d => d.isActive).length} Active
          </Badge>
          <Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-200">
            {devices.filter(d => !d.isActive).length} Inactive
          </Badge>
          {devices.some(d => d.participatingInEvent) && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200">
              {devices.filter(d => d.participatingInEvent).length} In Event
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {locations.map(location => (
          <div key={location} className="mb-6">
            <h3 className="font-medium text-lg mb-3 border-b pb-2">{location}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices
                .filter(device => device.location === location)
                .map((device) => {
                  const DeviceIcon = deviceIcons[device.icon];
                  return (
                    <div
                      key={device.id}
                      className={`p-4 rounded-lg border ${
                        !device.isActive 
                          ? "bg-gray-50 border-gray-200" 
                          : device.participatingInEvent
                            ? "bg-blue-50 border-blue-200" 
                            : device.type === "Generation" 
                              ? "bg-green-50 border-green-200" 
                              : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-2 ${
                            !device.isActive 
                              ? "bg-gray-100 text-gray-600" 
                              : device.participatingInEvent
                                ? "bg-blue-100 text-blue-600" 
                                : device.type === "Generation" 
                                  ? "bg-green-100 text-green-600" 
                                  : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <DeviceIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{device.name}</h3>
                            <p className="text-xs text-muted-foreground">{device.type}</p>
                          </div>
                        </div>
                        <Switch
                          checked={device.isActive}
                          onCheckedChange={() => toggleDeviceStatus(device.id)}
                          disabled={device.participatingInEvent}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-1 text-xs mt-3">
                        <div className="text-muted-foreground">Rating:</div>
                        <div className="text-right font-medium">{device.rating} W</div>
                        
                        <div className="text-muted-foreground">Consumption:</div>
                        <div className="text-right font-medium">
                          {device.baseKWh.toFixed(5)} kWh/min
                        </div>
                        
                        <div className="text-muted-foreground">Status:</div>
                        <div className="text-right">
                          <Badge variant="outline" className={`text-xs ${
                            !device.isActive 
                              ? "bg-gray-500/10 text-gray-700 border-gray-200" 
                              : device.participatingInEvent
                                ? "bg-blue-500/10 text-blue-700 border-blue-200" 
                                : device.type === "Generation" 
                                  ? "bg-green-500/10 text-green-700 border-green-200" 
                                  : "bg-blue-500/10 text-blue-700 border-blue-200"
                            }`}
                          >
                            {device.participatingInEvent 
                              ? "In Event" 
                              : device.isActive 
                                ? "Active" 
                                : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
