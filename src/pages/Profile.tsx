
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileSection } from "@/components/Profile/UserProfileSection";
import { LeaderboardSection } from "@/components/Profile/LeaderboardSection";
import { GridVisualization } from "@/components/Profile/GridVisualization";
import { BillingSection } from "@/components/Profile/BillingSection";
import { useSearchParams } from "react-router-dom";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (tabFromUrl && ["profile", "grid", "billing", "leaderboard"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  return (
    <DashboardLayout>
      <main className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold gradient-heading">My Profile</h1>
          <p className="text-muted-foreground">
            View your personal information, grid connection details, and performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="grid">My Grid</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <UserProfileSection />
          </TabsContent>
          
          <TabsContent value="grid" className="space-y-4">
            <GridVisualization />
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-4">
            <BillingSection />
          </TabsContent>
          
          <TabsContent value="leaderboard" className="space-y-4">
            <LeaderboardSection />
          </TabsContent>
        </Tabs>
      </main>
    </DashboardLayout>
  );
};

export default Profile;
