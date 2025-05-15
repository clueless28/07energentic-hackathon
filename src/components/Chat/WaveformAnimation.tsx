
import { useEffect, useRef } from "react";

export const WaveformAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let bars: { x: number; height: number; speed: number; direction: number }[] = [];
    
    // Set canvas dimensions
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initBars();
    };

    // Create bars for visualization
    const initBars = () => {
      const barCount = Math.floor(canvas.width / 8);
      bars = [];
      
      for (let i = 0; i < barCount; i++) {
        bars.push({
          x: i * 8,
          height: Math.random() * (canvas.height * 0.6) + 10,
          speed: 0.5 + Math.random() * 0.5,
          direction: Math.random() > 0.5 ? 1 : -1
        });
      }
    };

    // Draw the animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw bars
      ctx.fillStyle = "rgba(104, 80, 255, 0.6)";
      
      bars.forEach(bar => {
        // Update bar height with smooth animation
        bar.height += bar.speed * bar.direction;
        
        if (bar.height > canvas.height * 0.7 || bar.height < canvas.height * 0.1) {
          bar.direction *= -1;
        }
        
        // Draw the bar
        const x = bar.x;
        const y = (canvas.height - bar.height) / 2;
        ctx.fillRect(x, y, 4, bar.height);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    window.addEventListener("resize", resize);
    resize();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-32 rounded-lg"
    />
  );
};
