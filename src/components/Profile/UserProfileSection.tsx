
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { userProfile, utilityInfo } from "@/lib/profileMockData";
import { Award, Leaf, Shield, Users } from "lucide-react";

export const UserProfileSection = () => {
  const iconMap = {
    "award": Award,
    "leaf": Leaf,
    "shield": Shield,
    "users": Users,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main profile card */}
      <Card className="lg:col-span-2 glass-card">
        <CardHeader className="flex flex-col items-center md:flex-row md:justify-between md:items-start">
          <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
              <CardDescription>{userProfile.email}</CardDescription>
              <p className="text-sm text-muted-foreground">{userProfile.address}</p>
              <p className="text-sm mt-1">Member since {new Date(userProfile.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</p>
              <p className="text-sm mt-1 font-medium">Consumer Type: {userProfile.consumerType}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end">
            <Badge variant="outline" className="bg-primary/10 text-primary mb-2">
              {userProfile.energyPlan}
            </Badge>
            <p className="text-sm text-muted-foreground">Account: {utilityInfo.accountNumber}</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="flex flex-col items-center p-4 rounded-lg bg-background/50">
              <span className="text-2xl font-semibold text-primary">{userProfile.savingsToDate}</span>
              <span className="text-sm text-muted-foreground">Savings to Date</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-background/50">
              <span className="text-2xl font-semibold text-primary">{userProfile.carbonReduced}</span>
              <span className="text-sm text-muted-foreground">Carbon Reduced</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-background/50">
              <span className="text-2xl font-semibold text-primary">{userProfile.eventsParticipated}</span>
              <span className="text-sm text-muted-foreground">Events Participated</span>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center px-3 py-2 rounded-md bg-background/50">
                <span>Notifications</span>
                <Badge variant={userProfile.preferences.notifications ? "default" : "outline"}>
                  {userProfile.preferences.notifications ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-md bg-background/50">
                <span>Auto Opt-In to Events</span>
                <Badge variant={userProfile.preferences.autoOptIn ? "default" : "outline"}>
                  {userProfile.preferences.autoOptIn ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-md bg-background/50">
                <span>Private Mode</span>
                <Badge variant={userProfile.preferences.privateMode ? "default" : "outline"}>
                  {userProfile.preferences.privateMode ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-md bg-background/50">
                <span>Data Sharing</span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {userProfile.preferences.dataSharingLevel}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Badges card */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Badges earned through participation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userProfile.badges.map((badge) => {
              const IconComponent = iconMap[badge.icon as keyof typeof iconMap];
              return (
                <div key={badge.id} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <h4 className="font-medium">{badge.name}</h4>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Earned on {new Date(badge.earned).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground w-full text-center">
            {userProfile.badges.length} badges earned so far
          </p>
        </CardFooter>
      </Card>
      
      {/* Utility connection details */}
      <Card className="lg:col-span-3 glass-card">
        <CardHeader>
          <CardTitle>Utility Connection Details</CardTitle>
          <CardDescription>Information about your grid connection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Provider Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utility Provider:</span>
                    <span className="font-medium">{utilityInfo.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Energy Plan:</span>
                    <span className="font-medium">{utilityInfo.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-medium">{utilityInfo.accountNumber}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Meter Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meter Number:</span>
                    <span className="font-medium">{utilityInfo.meterNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meter Type:</span>
                    <span className="font-medium">{utilityInfo.meterType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Address:</span>
                    <span className="font-medium">{utilityInfo.serviceAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">City:</span>
                    <span className="font-medium">{utilityInfo.meterDetails?.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pincode:</span>
                    <span className="font-medium">{utilityInfo.meterDetails?.pincode}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Grid Connection</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transformer ID:</span>
                    <span className="font-medium">{utilityInfo.transformerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Substation ID:</span>
                    <span className="font-medium">{utilityInfo.substationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grid Region:</span>
                    <span className="font-medium">{utilityInfo.gridRegion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Latitude/Longitude:</span>
                    <span className="font-medium">{utilityInfo.meterDetails?.latitude}, {utilityInfo.meterDetails?.longitude}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-medium mb-4">Meter Load Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Consumption Load Factor</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {utilityInfo.meterDetails?.consumptionLoadFactor}
                  </Badge>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Production Load Factor</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {utilityInfo.meterDetails?.productionLoadFactor}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium mb-4">Distributed Energy Resources (DER)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {utilityInfo.derResources.map((resource) => (
                <div key={resource.id} className="p-4 rounded-lg bg-background/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{resource.type}</span>
                    <Badge variant={resource.status === "Active" ? "default" : "outline"}>
                      {resource.status}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{resource.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Installed:</span>
                      <span>{new Date(resource.installed).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
