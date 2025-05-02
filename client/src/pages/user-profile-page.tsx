import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { User, Toy, ToyWithDistance, Wish } from '@shared/schema';
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
import { Button } from '@/components/ui/button';
import { Loader2, CalendarDays, MapPin, Award, MessageSquare, Mail, Heart, UserPlus, UserMinus, ThumbsUp } from 'lucide-react';
import { AvatarWithFallback } from '@/components/ui/avatar-with-fallback';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { UserBadge } from '@/components/ui/user-badge';


const UserProfilePage: React.FC = () => {
  const params = useParams();
  const userId = params.userId ? parseInt(params.userId) : undefined;
  const [location, navigate] = useLocation();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('active');
  
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  const { data: toys = [], isLoading: toysLoading } = useQuery<Toy[]>({
    queryKey: [`/api/users/${userId}/toys`],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/toys`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user's toys");
      }
      return response.json();
    },
    enabled: !!userId,
  });
  
  const { data: wishes = [], isLoading: wishesLoading } = useQuery<Wish[]>({
    queryKey: [`/api/users/${userId}/wishes`],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/wishes`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user's wishes");
      }
      return response.json();
    },
    enabled: !!userId,
  });
  
  // Check if current user is following the profile user
  const { data: followStatus } = useQuery<{isFollowing: boolean}>({
    queryKey: [`/api/follow-status/${userId}`],
    enabled: !!userId && !!currentUser,
  });
  
  // Update following state when data changes
  useEffect(() => {
    if (followStatus) {
      setIsFollowing(followStatus.isFollowing);
    }
  }, [followStatus]);
  
  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "POST", 
        `/api/users/${isFollowing ? 'unfollow' : 'follow'}`, 
        { userId }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: isFollowing ? 'Unfollowed' : 'Following',
        description: isFollowing 
          ? `You are no longer following ${user?.name}` 
          : `You are now following ${user?.name}`,
      });
      setIsFollowing(!isFollowing);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to ${isFollowing ? 'unfollow' : 'follow'} user`,
        variant: 'destructive',
      });
    }
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/messages", {
        receiverId: userId,
        content: messageContent,
        toyId: 0, // Using 0 for general messages not tied to a specific toy
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Message Sent',
        description: `Your message has been sent to ${user?.name}`,
      });
      setMessageDialogOpen(false);
      setMessageContent('');
      // Redirect to messages page
      navigate('/messages');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      console.error('Message sending error:', error);
    }
  });
  
  // Handle message sending
  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a message',
        variant: 'destructive',
      });
      return;
    }
    sendMessageMutation.mutate();
  };
  
  // Handle request button clicks
  const handleRequestToy = (toy: ToyWithDistance) => {
    navigate(`/toys/${toy.id}`);
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
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profilePicture || ''} alt={user.name} />
                <AvatarFallback className="bg-primary text-xl">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {user.currentBadge && (
                <UserBadge 
                  badgeName={user.currentBadge} 
                  showTooltip={true} 
                  size="lg"
                  className="text-xl w-full text-center justify-center" 
                />
              )}
              
              <div className="text-center mt-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.username}</CardDescription>
              </div>
            </div>
            {currentUser && currentUser.id !== userId && (
              <div className="flex gap-2 mt-4">
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => setMessageDialogOpen(true)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user.bio && (
                <div>
                  <p className="text-sm text-neutral-700">{user.bio}</p>
                  <Separator className="my-3" />
                </div>
              )}
            
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 opacity-70" />
                <span>{user.email}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span>Joined {user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Unknown'}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 opacity-70" />
                <span>
                  {user.locationPrivacy === 'exact_location' ? user.location : 
                   user.locationPrivacy === 'private' ? 'Location hidden' : 
                   user.cityName || user.location.split(',')[0]}
                </span>
              </div>
              
              <Separator className="my-3" />
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">{user.toysShared || 0}</p>
                  <p className="text-sm text-blue-700">Toys Shared</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">{user.successfulExchanges || 0}</p>
                  <p className="text-sm text-green-700">Exchanges</p>
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
              
              {currentUser && (user as any).rating && (user as any).rating > 0 && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      Trust Score
                    </h3>
                    <div className="flex items-center">
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${Math.min((user as any).rating * 20, 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{(user as any).rating}/5</span>
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

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to {user?.name}</DialogTitle>
            <DialogDescription>
              Write your message below. The recipient will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Your message..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending || !messageContent.trim()}
            >
              {sendMessageMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : 'Send Message'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfilePage;