import React, { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { User, Toy, ToyWithDistance } from '@shared/schema';
import { format } from 'date-fns';
import { 
  Tabs, 
  TabsContent, 
  TabsList,
  TabsTrigger 
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ToyCard } from '@/components/toys/toy-card';
import { Loader2, CalendarDays, MapPin, Award } from 'lucide-react';


const UserProfilePage: React.FC = () => {
  const params = useParams();
  const userId = params.userId ? parseInt(params.userId) : undefined;
  
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  const { data: toys, isLoading: toysLoading } = useQuery<Toy[]>({
    queryKey: [`/api/users/${userId}/toys`],
    enabled: !!userId,
  });

  const [selectedTab, setSelectedTab] = useState('active');
  
  // Handle request button clicks
  const handleRequestToy = (toy: ToyWithDistance) => {
    window.location.href = `/toys/${toy.id}`;
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
        <p className="text-muted-foreground">The user you're looking for doesn't exist or may have been removed.</p>
      </div>
    );
  }

  const activeToys = toys?.filter(toy => toy.status === 'active') || [];
  const soldToys = toys?.filter(toy => toy.status === 'sold') || [];

  return (
    <div className="container py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.profilePicture || ''} alt={user.name} />
                <AvatarFallback className="bg-primary text-lg">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.username}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>


            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span>Joined {user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Unknown'}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 opacity-70" />
                <span>{user.location}</span>
              </div>
              
              <Separator className="my-3" />
              
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-2xl font-bold">{user.toysShared}</p>
                  <p className="text-xs text-muted-foreground">Toys Shared</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.successfulExchanges}</p>
                  <p className="text-xs text-muted-foreground">Exchanges</p>
                </div>
              </div>
              
              {user.specialBadges && user.specialBadges.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Award className="mr-1 h-4 w-4" />
                      Special Achievements
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {user.specialBadges.map((badge, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Toys Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="active" onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Active Toys ({activeToys.length})
              </TabsTrigger>
              <TabsTrigger value="sold">
                Sold Toys ({soldToys.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-6">
              {toysLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : activeToys.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeToys.map(toy => (
                    <ToyCard key={toy.id} toy={toy as ToyWithDistance} onRequestClick={handleRequestToy} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No active toys available</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="sold" className="mt-6">
              {toysLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : soldToys.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {soldToys.map(toy => (
                    <ToyCard key={toy.id} toy={toy as ToyWithDistance} onRequestClick={handleRequestToy} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No sold toys yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;