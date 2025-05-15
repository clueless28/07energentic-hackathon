
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { leaderboardData } from "@/lib/profileMockData";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Leaf, Zap } from "lucide-react";

export const LeaderboardSection = () => {
  const [leaderboardType, setLeaderboardType] = useState("points");
  
  // Find current user in the leaderboard
  const currentUserRank = leaderboardData.findIndex(user => user.name === "Alexander Chen") + 1;
  
  const getSortedData = () => {
    switch(leaderboardType) {
      case "savings":
        return [...leaderboardData].sort((a, b) => {
          const aValue = parseInt(a.savings.split(" ")[0]);
          const bValue = parseInt(b.savings.split(" ")[0]);
          return bValue - aValue;
        });
      case "carbon":
        return [...leaderboardData].sort((a, b) => {
          const aValue = parseInt(a.carbon.split(" ")[0]);
          const bValue = parseInt(b.carbon.split(" ")[0]);
          return bValue - aValue;
        });
      case "points":
      default:
        return [...leaderboardData].sort((a, b) => b.points - a.points);
    }
  };
  
  const sortedData = getSortedData();
  
  return (
    <div className="space-y-8">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <CardTitle>Community Leaderboard</CardTitle>
              <CardDescription>See how you compare with other GridSense users</CardDescription>
            </div>
            <Tabs 
              defaultValue="points" 
              value={leaderboardType} 
              onValueChange={setLeaderboardType}
              className="w-full md:w-auto mt-4 md:mt-0"
            >
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="points">
                  <Award className="mr-1 h-4 w-4" /> Points
                </TabsTrigger>
                <TabsTrigger value="savings">
                  <Zap className="mr-1 h-4 w-4" /> Energy Saved
                </TabsTrigger>
                <TabsTrigger value="carbon">
                  <Leaf className="mr-1 h-4 w-4" /> Carbon Reduced
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>User</TableHead>
                {leaderboardType === "points" && <TableHead className="text-right">Points</TableHead>}
                {leaderboardType === "savings" && <TableHead className="text-right">Energy Saved</TableHead>}
                {leaderboardType === "carbon" && <TableHead className="text-right">Carbon Reduced</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((user) => (
                <TableRow 
                  key={user.rank} 
                  className={user.name === "Alexander Chen" ? "bg-primary/5 font-medium" : ""}
                >
                  <TableCell className="font-medium">
                    {user.rank <= 3 ? (
                      <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                        ${user.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                          user.rank === 2 ? 'bg-gray-100 text-gray-700' : 
                          'bg-amber-100 text-amber-700'}`}>
                        {user.rank}
                      </div>
                    ) : (
                      user.rank
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {user.name}
                      {user.name === "Alexander Chen" && (
                        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                          You
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  {leaderboardType === "points" && (
                    <TableCell className="text-right">{user.points.toLocaleString()}</TableCell>
                  )}
                  {leaderboardType === "savings" && (
                    <TableCell className="text-right">{user.savings}</TableCell>
                  )}
                  {leaderboardType === "carbon" && (
                    <TableCell className="text-right">{user.carbon}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-center">Your Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="text-6xl font-bold text-primary">{currentUserRank}</div>
            </div>
            <p className="text-center text-muted-foreground mt-2">
              out of {leaderboardData.length} users
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-center">Energy Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center">
              <Zap className="w-6 h-6 text-primary mr-2" />
              <div className="text-4xl font-bold text-primary">982 kWh</div>
            </div>
            <p className="text-center text-muted-foreground mt-2">
              Equivalent to 4 months of average usage
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-center">Carbon Reduced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center">
              <Leaf className="w-6 h-6 text-primary mr-2" />
              <div className="text-4xl font-bold text-primary">768 kg</div>
            </div>
            <p className="text-center text-muted-foreground mt-2">
              Equivalent to planting 12 trees
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
