
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const StatsCards = () => {
  const [stats, setStats] = useState({
    totalEarnings: "$0.00",
    energySaved: "0 kWh",
    carbonReduced: "0 kg CO₂"
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('user_energy_stats')
          .select('*')
          .limit(1);
          
        if (error) {
          console.error("Error fetching stats:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setStats({
            totalEarnings: data[0].total_earnings || "$0.00",
            energySaved: data[0].energy_saved || "0 kWh",
            carbonReduced: data[0].carbon_reduced || "0 kg CO₂"
          });
        }
      } catch (error) {
        console.error("Error in stats fetch:", error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <div className="text-3xl font-bold gradient-heading">{stats.totalEarnings}</div>
          <p className="text-xs text-muted-foreground mt-1">Total Earnings</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <div className="text-3xl font-bold text-gridsense-700">{stats.energySaved}</div>
          <p className="text-xs text-muted-foreground mt-1">Energy Saved</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <div className="text-3xl font-bold text-accent">{stats.carbonReduced}</div>
          <p className="text-xs text-muted-foreground mt-1">Carbon Reduced</p>
        </CardContent>
      </Card>
    </>
  );
};
