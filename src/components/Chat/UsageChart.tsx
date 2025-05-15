
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for the chart
const mockData = [
  { day: "Mon", usage: 34 },
  { day: "Tue", usage: 42 },
  { day: "Wed", usage: 28 },
  { day: "Thu", usage: 36 },
  { day: "Fri", usage: 31 },
  { day: "Sat", usage: 21 },
  { day: "Sun", usage: 18 },
];

export const UsageChart = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h4 className="text-sm font-medium mb-2">Weekly Energy Usage (kWh)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="usage"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUsage)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
