import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, Clock, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function GroupDetailsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const params = useParams();
  const groupId = params.groupId ? parseInt(params.groupId) : null;
  
  const { data: group, isLoading: loadingGroup } = useQuery({
    queryKey: ["/api/groups", groupId],
    queryFn: undefined,
    enabled: !!groupId
  });
  
  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ["/api/groups", groupId, "members"],
    queryFn: undefined,
    enabled: !!groupId
  });
  
  if (loadingGroup || loadingMembers) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!group) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-4">Group not found</h1>
        <Link href="/community/groups">
          <Button variant="outline" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Groups
          </Button>
        </Link>
      </div>
    );
  }
  
  const isGroupMember = members?.some(member => user && member.userId === user.id);
  
  return (
    <div className="container py-8">
      <Link href="/community/groups">
        <Button variant="ghost" className="mb-4 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Groups
        </Button>
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Group info card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{group.name}</CardTitle>
                <CardDescription>{group.location}</CardDescription>
              </div>
              <Badge variant={group.isPublic ? "secondary" : "outline"}>
                {group.isPublic ? 'Public' : 'Private'} Group
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{group.memberCount} members</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="mb-6">{group.description}</p>
            
            {user && (
              isGroupMember ? (
                <Button variant="destructive">Leave Group</Button>
              ) : (
                <Button>Join Group</Button>
              )
            )}
          </CardContent>
        </Card>
        
        {/* Members card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {members && members.length > 0 ? (
              <div className="space-y-3">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user?.profilePicture || ''} />
                        <AvatarFallback>{member.user?.name.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.user?.name}</p>
                        <p className="text-xs text-muted-foreground">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {member.role === 'admin' && (
                      <Badge variant="outline" className="text-xs">Admin</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No members in this group yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Tabs defaultValue="discussions">
          <TabsList>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="toys">Shared Toys</TabsTrigger>
          </TabsList>
          <TabsContent value="discussions" className="py-4">
            <p className="text-muted-foreground text-center py-4">
              Group discussions will be available in a future update.
            </p>
          </TabsContent>
          <TabsContent value="events" className="py-4">
            <p className="text-muted-foreground text-center py-4">
              Group events will be available in a future update.
            </p>
          </TabsContent>
          <TabsContent value="toys" className="py-4">
            <p className="text-muted-foreground text-center py-4">
              Toys shared in this group will be displayed here.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}