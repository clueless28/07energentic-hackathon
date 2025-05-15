
import { useState } from "react";
import { DashboardLayout } from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Search, Settings, ShoppingBag, Star, Tag, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BecknBranding } from "@/components/BecknBranding";
import { participateInOffer } from "@/utils/becknProtocol";

// Dummy data for marketplace offers
const marketplaceOffers = [
  {
    id: "offer-001",
    title: "Dynamic Price Plan",
    provider: "EnergyCo",
    type: "price-plan",
    description: "Maximize your savings with our AI-optimized dynamic price plan. Get better rates during solar surplus and lower your peak demand charges.",
    incentives: ["Up to 30% savings", "No fixed fee", "Hourly price signals"],
    rating: 4.8,
    reviews: 325,
    tag: "Popular"
  },
  {
    id: "offer-002",
    title: "Solar Buyback Premium",
    provider: "SunShare",
    type: "generation",
    description: "Sell your excess solar generation at premium rates when grid demand is high. Our buyback program pays more than standard feed-in tariffs.",
    incentives: ["Up to 2x standard rates", "No minimum requirement", "Real-time optimization"],
    rating: 4.6,
    reviews: 184,
    tag: "New"
  },
  {
    id: "offer-003",
    title: "Community Battery Access",
    provider: "GridShare",
    type: "storage",
    description: "Gain access to neighborhood battery storage without installation. Store your excess energy and use it when prices are high.",
    incentives: ["No upfront cost", "Pay-as-you-go", "AI optimization"],
    rating: 4.3,
    reviews: 98,
    tag: null
  },
  {
    id: "offer-004",
    title: "EV Smart Charging",
    provider: "ChargeWise",
    type: "ev-charging",
    description: "Optimize your EV charging schedule based on electricity prices and carbon intensity. Earn rewards for grid-supporting charging behavior.",
    incentives: ["$50 sign-up bonus", "Up to $30/month in rewards", "Carbon tracking"],
    rating: 4.7,
    reviews: 211,
    tag: "Hot"
  }
];

// Dummy data for marketplace activities
const marketplaceActivities = [
  {
    id: "activity-001",
    title: "Morning Peak Bid",
    date: "2025-05-08",
    time: "6:45 AM",
    description: "Your AI agent placed a successful bid in the morning peak reduction market",
    value: "$3.25",
    type: "bid-accepted"
  },
  {
    id: "activity-002",
    title: "Community Battery Discharge",
    date: "2025-05-07",
    time: "5:30 PM",
    description: "Discharged 2.4 kWh from your community battery allocation during high price period",
    value: "$1.85",
    type: "storage-used"
  },
  {
    id: "activity-003",
    title: "Solar Surplus Sold",
    date: "2025-05-07",
    time: "12:15 PM",
    description: "Sold 3.8 kWh of excess solar generation at premium rates",
    value: "$2.66",
    type: "energy-sold"
  }
];

const Marketplace = () => {
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState<string | null>(null);
  
  const handleJoinOffer = async (offerId: string, provider: string) => {
    setIsJoining(offerId);
    
    try {
      // Use the Beckn protocol to participate in the offer
      await participateInOffer(provider, offerId);
      
      toast({
        title: "Offer Joined",
        description: "Your AI agent will optimize participation in this program"
      });
    } catch (error) {
      console.error("Error joining offer:", error);
      toast({
        title: "Error Joining Offer",
        description: "There was an error joining the program. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(null);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold gradient-heading">Energy Marketplace</h1>
            <p className="text-muted-foreground">Discover and participate in energy services and programs</p>
          </div>
          
          <div className="flex items-center gap-4">
            <BecknBranding variant="inline" />
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" /> Preferences
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search marketplace offers..." 
              className="w-full pl-9 py-2 pr-4 border rounded-md bg-background"
            />
          </div>
        </div>
        
        <Tabs defaultValue="offers">
          <TabsList className="mb-4">
            <TabsTrigger value="offers">Available Offers</TabsTrigger>
            <TabsTrigger value="activity">Market Activity</TabsTrigger>
            <TabsTrigger value="subscribed">My Programs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="offers" className="space-y-4">
            {marketplaceOffers.map((offer) => (
              <Card key={offer.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-medium">{offer.title}</h3>
                        {offer.tag && (
                          <Badge className={`${
                            offer.tag === "Popular" ? "bg-blue-500/20 text-blue-700 border-blue-200" :
                            offer.tag === "New" ? "bg-green-500/20 text-green-700 border-green-200" :
                            "bg-orange-500/20 text-orange-700 border-orange-200"
                          }`}>
                            {offer.tag}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        Offered by {offer.provider}
                      </p>
                      
                      <p className="mb-4">{offer.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {offer.incentives.map((incentive, idx) => (
                          <Badge key={idx} variant="outline" className="bg-primary/10 border-primary/30">
                            <Zap className="h-3 w-3 mr-1 text-primary" />
                            {incentive}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(offer.rating) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : i < offer.rating 
                                  ? 'text-yellow-400 fill-yellow-400 opacity-50' 
                                  : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-sm">{offer.rating}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {offer.reviews} reviews
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 flex flex-col items-end">
                      <Badge className={`mb-3 ${
                        offer.type === "price-plan" ? "bg-purple-500/20 text-purple-700 border-purple-200" :
                        offer.type === "generation" ? "bg-green-500/20 text-green-700 border-green-200" :
                        offer.type === "storage" ? "bg-blue-500/20 text-blue-700 border-blue-200" :
                        "bg-orange-500/20 text-orange-700 border-orange-200"
                      }`}>
                        {offer.type === "price-plan" ? "Price Plan" :
                         offer.type === "generation" ? "Generation" :
                         offer.type === "storage" ? "Storage" :
                         "EV Charging"}
                      </Badge>
                      
                      <Button 
                        className="px-6"
                        disabled={isJoining === offer.id}
                        onClick={() => handleJoinOffer(offer.id, offer.provider)}
                      >
                        {isJoining === offer.id ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                            Processing
                          </>
                        ) : (
                          "Join Program"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Recent Market Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketplaceActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start p-3 border rounded-md">
                      <div className={`rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 ${
                        activity.type === "bid-accepted" ? "bg-green-100 text-green-600" :
                        activity.type === "storage-used" ? "bg-blue-100 text-blue-600" :
                        "bg-purple-100 text-purple-600"
                      }`}>
                        {activity.type === "bid-accepted" && (
                          <Tag className="h-5 w-5" />
                        )}
                        {activity.type === "storage-used" && (
                          <ShoppingBag className="h-5 w-5" />
                        )}
                        {activity.type === "energy-sold" && (
                          <Zap className="h-5 w-5" />
                        )}
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {activity.date} at {activity.time}
                            </p>
                          </div>
                          <div className="text-lg font-medium text-green-600">
                            {activity.value}
                          </div>
                        </div>
                        <p className="text-sm mt-1">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscribed">
            <Card className="p-6">
              <div className="text-center py-8">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No Active Programs</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You don't have any active marketplace subscriptions yet. Browse available offers to join programs that match your needs.
                </p>
                <Button>Browse Marketplace</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="border-t p-4 bg-slate-50 dark:bg-slate-900 flex justify-center">
        <BecknBranding />
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
