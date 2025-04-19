import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Loader2, 
  Trophy,
  GiftIcon,
  HandshakeIcon,
  LeafIcon, 
  Users, 
  BadgeCheck,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function LeaderboardPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [leaderboardType, setLeaderboardType] = useState<"points" | "shared" | "exchanges">("points");
  
  // Fetch community metrics
  const { data: communityMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/community-metrics"],
    queryFn: undefined,
    enabled: true
  });
  
  // Fetch leaderboard data
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["/api/leaderboard", { type: leaderboardType }],
    queryFn: undefined,
    enabled: true
  });
  
  // Get badge color based on position
  const getBadgeColor = (position: number) => {
    switch (position) {
      case 1: return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 2: return "bg-slate-100 text-slate-800 border-slate-300";
      case 3: return "bg-amber-100 text-amber-800 border-amber-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  // Get badge icon based on position
  const getBadgeIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-4 w-4 text-yellow-600" />;
      case 2: return <Trophy className="h-4 w-4 text-slate-600" />;
      case 3: return <Trophy className="h-4 w-4 text-amber-600" />;
      default: return <BadgeCheck className="h-4 w-4 text-gray-600" />;
    }
  };
  
  if (isLoading || metricsLoading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community Leaderboard</h1>
          <p className="text-muted-foreground">
            Celebrate our top contributors and their impact
          </p>
        </div>
        
        <Tabs value={leaderboardType} onValueChange={(v) => setLeaderboardType(v as any)} className="w-full max-w-md">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="points">
              <Trophy className="h-4 w-4 mr-2" />
              Points
            </TabsTrigger>
            <TabsTrigger value="shared">
              <GiftIcon className="h-4 w-4 mr-2" />
              Toys Shared
            </TabsTrigger>
            <TabsTrigger value="exchanges">
              <HandshakeIcon className="h-4 w-4 mr-2" />
              Exchanges
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Toys Saved</CardTitle>
            <CardDescription>From landfills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {communityMetrics?.toysSaved || 0}
              <LeafIcon className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t text-sm text-muted-foreground">
            Keeping toys in circulation
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Families Connected</CardTitle>
            <CardDescription>Through sharing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {communityMetrics?.familiesConnected || 0}
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t text-sm text-muted-foreground">
            Building community bonds
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Waste Reduced</CardTitle>
            <CardDescription>Estimated in kg</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {communityMetrics?.wasteReduced || 0}
              <LeafIcon className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t text-sm text-muted-foreground">
            Environmental impact
          </CardFooter>
        </Card>
      </div>
      
      <TabsContent value="points" className="mt-0 space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Points Leaderboard
          </h2>
          
          {leaderboardData?.byPoints && leaderboardData.byPoints.length > 0 ? (
            <div className="space-y-4">
              {leaderboardData.byPoints.map((user, index) => (
                <Link key={user.id} href={`/users/${user.id}`}>
                  <a className="block">
                    <div className="bg-white rounded-md p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={`rounded-full w-8 h-8 flex items-center justify-center text-base font-bold ${getBadgeColor(index + 1)}`}>
                          {index + 1}
                        </Badge>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profilePicture || undefined} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.username}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="font-bold text-lg flex items-center gap-1">
                          {user.points}
                          <Trophy className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.rank === "up" ? 
                            <span className="text-green-600 flex items-center gap-1">
                              <ArrowUp className="h-3 w-3" /> Rising
                            </span> : 
                            user.currentBadge
                          }
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 text-muted-foreground mb-4 mx-auto opacity-30" />
              <h3 className="text-xl font-semibold">No data yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Start earning points by sharing toys, completing exchanges, and being an active community member.
              </p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="shared" className="mt-0 space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <GiftIcon className="h-5 w-5 text-green-500" />
            Most Toys Shared
          </h2>
          
          {leaderboardData?.byToysShared && leaderboardData.byToysShared.length > 0 ? (
            <div className="space-y-4">
              {leaderboardData.byToysShared.map((user, index) => (
                <Link key={user.id} href={`/users/${user.id}`}>
                  <a className="block">
                    <div className="bg-white rounded-md p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={`rounded-full w-8 h-8 flex items-center justify-center text-base font-bold ${getBadgeColor(index + 1)}`}>
                          {index + 1}
                        </Badge>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profilePicture || undefined} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.username}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="font-bold text-lg flex items-center gap-1">
                          {user.toysShared}
                          <GiftIcon className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.currentBadge}
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <GiftIcon className="h-16 w-16 text-muted-foreground mb-4 mx-auto opacity-30" />
              <h3 className="text-xl font-semibold">No data yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Start sharing toys with your community to appear on this leaderboard.
              </p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="exchanges" className="mt-0 space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HandshakeIcon className="h-5 w-5 text-purple-500" />
            Most Successful Exchanges
          </h2>
          
          {leaderboardData?.bySuccessfulExchanges && leaderboardData.bySuccessfulExchanges.length > 0 ? (
            <div className="space-y-4">
              {leaderboardData.bySuccessfulExchanges.map((user, index) => (
                <Link key={user.id} href={`/users/${user.id}`}>
                  <a className="block">
                    <div className="bg-white rounded-md p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={`rounded-full w-8 h-8 flex items-center justify-center text-base font-bold ${getBadgeColor(index + 1)}`}>
                          {index + 1}
                        </Badge>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.profilePicture || undefined} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.username}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="font-bold text-lg flex items-center gap-1">
                          {user.successfulExchanges}
                          <HandshakeIcon className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.currentBadge}
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HandshakeIcon className="h-16 w-16 text-muted-foreground mb-4 mx-auto opacity-30" />
              <h3 className="text-xl font-semibold">No data yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mt-2">
                Complete exchanges with other families to appear on this leaderboard.
              </p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-bold mb-4">How to Earn Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <GiftIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Share a Toy</h3>
                <p className="text-sm text-muted-foreground">10 points each time someone receives your toy</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <HandshakeIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Complete an Exchange</h3>
                <p className="text-sm text-muted-foreground">5 points for each successful exchange</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Join a Community Group</h3>
                <p className="text-sm text-muted-foreground">3 points for each group you join</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <BadgeCheck className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Receive a Positive Review</h3>
                <p className="text-sm text-muted-foreground">5 points each time you get 5-star feedback</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Suggest a Verified Meetup Location</h3>
                <p className="text-sm text-muted-foreground">10 points when your suggested location is verified</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Trophy className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="font-medium">Earn Sustainability Badges</h3>
                <p className="text-sm text-muted-foreground">Special point bonuses for earning badges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}