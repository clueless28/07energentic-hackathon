import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gridComponents, maintenanceEvents } from "@/lib/profileMockData";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, Zap } from "lucide-react";

export const GridVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [flowParticles, setFlowParticles] = useState<any[]>([]);
  const animationRef = useRef<number | null>(null);

  // Draw grid components and connections
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw connections first (lines)
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 3;
    
    gridComponents.forEach(component => {
      component.connections.forEach(connectionId => {
        const connectedComponent = gridComponents.find(c => c.id === connectionId);
        if (connectedComponent) {
          const startX = component.position.x * canvas.width / 100;
          const startY = component.position.y * canvas.height / 100;
          const endX = connectedComponent.position.x * canvas.width / 100;
          const endY = connectedComponent.position.y * canvas.height / 100;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          
          // Use different style for maintenance lines
          if (component.status.includes('Maintenance') || connectedComponent.status.includes('Maintenance')) {
            ctx.strokeStyle = '#f59e0b';
            ctx.setLineDash([5, 3]);
          } else {
            ctx.strokeStyle = '#0ea5e9';
            ctx.setLineDash([]);
          }
          
          ctx.stroke();
        }
      });
    });
    
    // Draw grid components (nodes)
    gridComponents.forEach(component => {
      const x = component.position.x * canvas.width / 100;
      const y = component.position.y * canvas.height / 100;
      
      ctx.beginPath();
      
      // Use different colors/sizes based on component type
      if (component.type === 'powerPlant') {
        ctx.fillStyle = '#10b981';
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
      } else if (component.type === 'substation') {
        ctx.fillStyle = component.status.includes('Maintenance') ? '#f59e0b' : '#3b82f6';
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
      } else if (component.type === 'transformer') {
        ctx.fillStyle = component.status.includes('Maintenance') ? '#f59e0b' : '#6366f1';
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
      } else if (component.type === 'meter') {
        ctx.fillStyle = '#8b5cf6';
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
      } else {
        ctx.fillStyle = '#64748b';
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
      }
      
      ctx.fill();
      
      // Draw a highlight ring for our user's specific components
      if (
        (component.type === 'transformer' && component.name === 'TRF-9876') ||
        (component.type === 'meter' && component.name === 'SGP-45678') ||
        (component.type === 'substation' && component.name === 'SUB-ECHO-42')
      ) {
        ctx.beginPath();
        ctx.arc(x, y, component.type === 'meter' ? 12 : 16, 0, 2 * Math.PI);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.stroke();
      }
    });
  }, []);

  // Click handler for canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if any component was clicked
    for (const component of gridComponents) {
      const compX = component.position.x * canvas.width / 100;
      const compY = component.position.y * canvas.height / 100;
      const radius = component.type === 'powerPlant' ? 15 : 
                     component.type === 'substation' ? 12 : 
                     component.type === 'transformer' ? 10 : 8;
      
      const distance = Math.sqrt(Math.pow(compX - x, 2) + Math.pow(compY - y, 2));
      
      if (distance <= radius) {
        setSelectedComponent(component);
        return;
      }
    }
    
    // If clicked outside any component, clear selection
    setSelectedComponent(null);
  };
  
  // Animation for electricity flow
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create initial flow particles
    const initialParticles: any[] = [];
    gridComponents.forEach(component => {
      if (component.connections.length > 0) {
        component.connections.forEach((connectionId: string) => {
          const connectedComponent = gridComponents.find(c => c.id === connectionId);
          if (connectedComponent) {
            const startX = component.position.x * canvas.width / 100;
            const startY = component.position.y * canvas.height / 100;
            const endX = connectedComponent.position.x * canvas.width / 100;
            const endY = connectedComponent.position.y * canvas.height / 100;
            
            // Skip maintenance lines
            if (component.status.includes('Maintenance') || connectedComponent.status.includes('Maintenance')) {
              return;
            }
            
            // Create 3 particles per line at different positions
            for (let i = 0; i < 3; i++) {
              initialParticles.push({
                x: startX + (endX - startX) * (i / 3),
                y: startY + (endY - startY) * (i / 3),
                targetX: endX,
                targetY: endY,
                startX,
                startY,
                speed: 0.005 + Math.random() * 0.005,
                progress: i / 3,
              });
            }
          }
        });
      }
    });
    
    setFlowParticles(initialParticles);
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw connections
      gridComponents.forEach(component => {
        component.connections.forEach(connectionId => {
          const connectedComponent = gridComponents.find(c => c.id === connectionId);
          if (connectedComponent) {
            const startX = component.position.x * canvas.width / 100;
            const startY = component.position.y * canvas.height / 100;
            const endX = connectedComponent.position.x * canvas.width / 100;
            const endY = connectedComponent.position.y * canvas.height / 100;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            
            if (component.status.includes('Maintenance') || connectedComponent.status.includes('Maintenance')) {
              ctx.strokeStyle = '#f59e0b';
              ctx.setLineDash([5, 3]);
            } else {
              ctx.strokeStyle = '#0ea5e9';
              ctx.setLineDash([]);
            }
            
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        });
      });
      
      // Draw components
      gridComponents.forEach(component => {
        const x = component.position.x * canvas.width / 100;
        const y = component.position.y * canvas.height / 100;
        
        ctx.beginPath();
        
        if (component.type === 'powerPlant') {
          ctx.fillStyle = '#10b981';
          ctx.arc(x, y, 15, 0, 2 * Math.PI);
        } else if (component.type === 'substation') {
          ctx.fillStyle = component.status.includes('Maintenance') ? '#f59e0b' : '#3b82f6';
          ctx.arc(x, y, 12, 0, 2 * Math.PI);
        } else if (component.type === 'transformer') {
          ctx.fillStyle = component.status.includes('Maintenance') ? '#f59e0b' : '#6366f1';
          ctx.arc(x, y, 10, 0, 2 * Math.PI);
        } else if (component.type === 'meter') {
          ctx.fillStyle = '#8b5cf6';
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
        } else {
          ctx.fillStyle = '#64748b';
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
        }
        
        ctx.fill();
        
        // Highlight user's components
        if (
          (component.type === 'transformer' && component.name === 'TRF-9876') ||
          (component.type === 'meter' && component.name === 'SGP-45678') ||
          (component.type === 'substation' && component.name === 'SUB-ECHO-42')
        ) {
          ctx.beginPath();
          ctx.arc(x, y, component.type === 'meter' ? 12 : 16, 0, 2 * Math.PI);
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.stroke();
        }
      });
      
      // Update and draw flow particles
      setFlowParticles(prev => {
        return prev.map(particle => {
          // Update particle position
          particle.progress += particle.speed;
          if (particle.progress >= 1) {
            particle.progress = 0;
          }
          
          particle.x = particle.startX + (particle.targetX - particle.startX) * particle.progress;
          particle.y = particle.startY + (particle.targetY - particle.startY) * particle.progress;
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#22d3ee';
          ctx.fill();
          
          return particle;
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle>Power Grid Visualization</CardTitle>
            <CardDescription>Interactive map of your grid connection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[16/9] border rounded-md overflow-hidden">
              <canvas 
                ref={canvasRef} 
                onClick={handleCanvasClick}
                className="w-full h-full cursor-pointer"
              />
              <div className="absolute bottom-4 left-4 bg-background/80 p-3 rounded-md backdrop-blur-sm">
                <div className="text-sm font-medium mb-2">Legend</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs">Power Plant</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-xs">Substation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                    <span className="text-xs">Transformer</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-xs">Meter</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span className="text-xs">Maintenance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full border-2 border-rose-500 bg-transparent mr-2"></div>
                    <span className="text-xs">Your Connection</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex items-center bg-background/80 px-3 py-1.5 rounded-md backdrop-blur-sm">
                <Zap className="w-4 h-4 text-cyan-400 mr-2" />
                <span className="text-xs font-medium">Live Power Flow</span>
              </div>
            </div>
            
            {selectedComponent && (
              <div className="mt-4 p-4 bg-background/50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{selectedComponent.name}</h3>
                  <Badge 
                    variant={selectedComponent.status === "Active" ? "default" : "outline"}
                    className={selectedComponent.status.includes("Maintenance") ? "bg-amber-500" : ""}
                  >
                    {selectedComponent.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    <span className="capitalize">{selectedComponent.type}</span>
                  </div>
                  {selectedComponent.capacity && (
                    <div>
                      <span className="text-muted-foreground">Capacity: </span>
                      <span>{selectedComponent.capacity}</span>
                    </div>
                  )}
                  {selectedComponent.voltage && (
                    <div>
                      <span className="text-muted-foreground">Voltage: </span>
                      <span>{selectedComponent.voltage}</span>
                    </div>
                  )}
                  {selectedComponent.output && (
                    <div>
                      <span className="text-muted-foreground">Output: </span>
                      <span>{selectedComponent.output}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Maintenance Events</CardTitle>
            <CardDescription>Scheduled and ongoing work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceEvents.map((event) => (
                <Alert key={event.id} variant={
                  event.status === "In Progress" ? "destructive" : "default"
                }>
                  {event.status === "In Progress" && <AlertTriangle className="h-4 w-4" />}
                  {event.status === "Planned" && <Info className="h-4 w-4" />}
                  <AlertTitle className="flex items-center justify-between">
                    {event.type}
                    <Badge variant={
                      event.status === "In Progress" ? "destructive" : 
                      event.status === "Planned" ? "outline" : "secondary"
                    }>
                      {event.status}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription>
                    <div className="mt-2">
                      <p className="mb-1"><strong>{event.component}:</strong> {event.componentId}</p>
                      <p className="text-sm">{event.description}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(event.scheduledStart).toLocaleString()} - {new Date(event.scheduledEnd).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1"><strong>Impact:</strong> {event.impact}</p>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
