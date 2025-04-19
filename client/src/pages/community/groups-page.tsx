import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Users, Search, Filter, X, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function GroupsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMyGroups, setShowMyGroups] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    isPublic: true
  });
  
  const { data: groups, isLoading } = useQuery({
    queryKey: ["/api/groups", { search: searchQuery, myGroups: showMyGroups ? user?.id : undefined }],
    queryFn: undefined,
    enabled: true
  });
  
  const createGroupMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // This would be a real API call in a real implementation
      return { id: Date.now(), ...data, createdAt: new Date(), memberCount: 1 };
    },
    onSuccess: () => {
      toast({
        title: "Group created",
        description: "Your group has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create group",
        description: "There was an error creating your group. Please try again.",
      });
    }
  });
  
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      isPublic: true
    });
  };
  
  const handleCreateGroup = () => {
    if (!formData.name || !formData.description) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    createGroupMutation.mutate(formData);
  };
  
  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Community Groups</h1>
          <p className="text-muted-foreground">
            Connect with families in your area who share similar interests
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Group</DialogTitle>
              <DialogDescription>
                Start a group to connect with families who share similar interests.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="Enter group name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="description" 
                  placeholder="What is this group about?" 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="City or neighborhood" 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isPublic" 
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, isPublic: checked as boolean })
                  }
                />
                <label htmlFor="isPublic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Make this group public (anyone can join)
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup} disabled={createGroupMutation.isPending}>
                {createGroupMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups by name or location"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox 
            id="my-groups" 
            checked={showMyGroups}
            onCheckedChange={(checked) => setShowMyGroups(!!checked)}
          />
          <Label htmlFor="my-groups">My Groups</Label>
        </div>
      </div>
      
      {groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link key={group.id} href={`/community/groups/${group.id}`}>
              <a className="block h-full">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{group.name}</CardTitle>
                      <Badge variant={group.isPublic ? "default" : "outline"}>
                        {group.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {group.location && (
                        <div className="text-sm mt-1">{group.location}</div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-3">{group.description}</p>
                  </CardContent>
                  <CardFooter className="pt-2 border-t flex justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <UsersRound className="h-4 w-4 text-muted-foreground" />
                      <span>{group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                  </CardFooter>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No groups found</h3>
          <p className="text-muted-foreground max-w-md mt-2 mb-6">
            {searchQuery 
              ? "No groups match your search criteria. Try a different search term."
              : showMyGroups 
                ? "You haven't joined any groups yet."
                : "There are no groups available. Create the first one!"
            }
          </p>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create a Group
          </Button>
        </div>
      )}
    </div>
  );
}