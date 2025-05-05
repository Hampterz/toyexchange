import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Loader2, MessageSquare, MoreVertical, Trash, UserX, BellOff, UserCircle } from "lucide-react";
import { AddToyModal } from "@/components/toys/add-toy-modal";
import { Conversation } from "@/components/toys/conversation";
import { Button } from "@/components/ui/button";
import { Message, User } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function MessagesPage() {
  const { user } = useAuth();
  const [isAddToyModalOpen, setIsAddToyModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
  const [mutedUsers, setMutedUsers] = useState<number[]>([]);

  // Get all messages for the current user
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    queryFn: async () => {
      const response = await fetch("/api/messages", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Get all users who have messaged with the current user
  const { data: conversationsData, isLoading: isLoadingConversations } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      if (!messagesData) return [];
      
      // Extract unique user IDs from messages
      const userIds = new Set<number>();
      messagesData.forEach((message: Message) => {
        if (message.senderId !== user?.id) {
          userIds.add(message.senderId);
        }
        if (message.receiverId !== user?.id) {
          userIds.add(message.receiverId);
        }
      });
      
      // Get user details for each unique user
      const userPromises = Array.from(userIds).map(async (userId) => {
        try {
          const response = await fetch(`/api/users/${userId}`, {
            credentials: "include",
          });
          
          if (!response.ok) {
            console.error(`Could not fetch user with ID ${userId}`);
            return null;
          }
          
          return await response.json();
        } catch (error) {
          console.error(`Error fetching user with ID ${userId}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(userPromises);
      // Filter out any null values from failed requests
      return results.filter((user): user is User => user !== null);
    },
    enabled: !!messagesData && !!user,
  });

  // Set the first conversation partner as selected by default
  useEffect(() => {
    if (conversationsData && conversationsData.length > 0 && !selectedUser) {
      setSelectedUser(conversationsData[0].id);
    }
  }, [conversationsData, selectedUser]);

  // Check for unread messages from each user
  const getUnreadCount = (userId: number) => {
    if (!messagesData) return 0;
    
    return messagesData.filter(
      (message: Message) => message.senderId === userId && message.receiverId === user?.id && !message.read
    ).length;
  };

  // Get the last message for a conversation
  const getLastMessage = (userId: number) => {
    if (!messagesData) return null;
    
    const conversationMessages = messagesData.filter(
      (message: Message) => 
        (message.senderId === userId && message.receiverId === user?.id) ||
        (message.senderId === user?.id && message.receiverId === userId)
    );
    
    if (conversationMessages.length === 0) return null;
    
    // Sort by date and get the most recent
    return conversationMessages.sort(
      (a: Message, b: Message) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
    )[0];
  };

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (otherUserId: number) => {
      try {
        const response = await fetch(`/api/conversations/${otherUserId}`, {
          method: "DELETE",
          credentials: "include"
        });
        
        if (!response.ok) {
          throw new Error("Failed to delete conversation");
        }
        
        toast({
          title: "Conversation deleted",
          description: "This conversation has been removed",
        });
        
        return otherUserId;
      } catch (error) {
        console.error("Error deleting conversation:", error);
        toast({
          title: "Failed to delete conversation",
          description: "Please try again later",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: (otherUserId) => {
      // Update the local state or refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      if (selectedUser === otherUserId) {
        // If the selected conversation was deleted, select another one or none
        const remainingUsers = conversationsData?.filter(u => u.id !== otherUserId && u.id !== user?.id);
        setSelectedUser(remainingUsers?.length ? remainingUsers[0].id : null);
      }
    }
  });

  // Block user mutation
  const blockUserMutation = useMutation({
    mutationFn: async (otherUserId: number) => {
      try {
        // Call API to block the user
        const response = await fetch("/api/user-blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            blockedId: otherUserId,
            reason: "Blocked from messages page"
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Failed to block user" }));
          throw new Error(errorData.message || "Failed to block user");
        }
        
        const data = await response.json();
        // Update local state for immediate UI feedback
        setBlockedUsers(prev => [...prev, otherUserId]);
        return data;
      } catch (error) {
        console.error("Block user error:", error);
        throw error;
      }
    },
    onSuccess: (_, otherUserId) => {
      // Update UI or refetch data as needed
      toast({
        title: "User blocked",
        description: "You will no longer receive messages from this user",
      });
      
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/user-blocks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      
      if (selectedUser === otherUserId) {
        const remainingUsers = conversationsData?.filter(
          u => u.id !== otherUserId && u.id !== user?.id && !blockedUsers.includes(u.id)
        );
        setSelectedUser(remainingUsers?.length ? remainingUsers[0].id : null);
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to block user",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Mute user mutation
  const muteUserMutation = useMutation({
    mutationFn: async (otherUserId: number) => {
      try {
        // Call API to mute the user
        const response = await fetch("/api/user-mutes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            mutedId: otherUserId
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Failed to mute user" }));
          throw new Error(errorData.message || "Failed to mute user");
        }
        
        const data = await response.json();
        // Update local state for immediate UI feedback
        setMutedUsers(prev => [...prev, otherUserId]);
        return data;
      } catch (error) {
        console.error("Mute user error:", error);
        throw error;
      }
    },
    onSuccess: (_, otherUserId) => {
      toast({
        title: "User muted",
        description: "You will no longer receive notifications from this user",
      });
      
      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/user-mutes"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to mute user",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // View user profile
  const viewUserProfile = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isLoading = isLoadingMessages || isLoadingConversations;

  return (
    <div className="page-transition bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <MessageSquare className="mr-2 h-6 w-6 text-primary" />
            Messages
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !conversationsData || conversationsData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-neutral-100 shadow-sm">
            <MessageSquare className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              When you message other users about their toys, you'll see your conversations here
            </p>
            <Button 
              onClick={() => window.location.href = "/"} 
              className="bg-primary hover:bg-primary/90 btn-animated"
            >
              Browse Toys
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Conversation List */}
            <div className="md:w-1/3 border-r">
              <div className="py-3 px-4 border-b bg-white">
                <h2 className="font-semibold text-neutral-700">Conversations</h2>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {conversationsData.map((otherUser) => {
                  if (otherUser.id === user.id) return null;
                  
                  const unreadCount = getUnreadCount(otherUser.id);
                  const lastMessage = getLastMessage(otherUser.id);
                  
                  return (
                    <div 
                      key={otherUser.id}
                      className={`p-4 cursor-pointer hover:bg-blue-50 transition ${
                        selectedUser === otherUser.id ? 'bg-blue-50 border-l-4 border-l-primary' : ''
                      }`}
                      onClick={() => setSelectedUser(otherUser.id)}
                    >
                      <div className="flex items-center gap-3">
                        <AvatarWithFallback user={otherUser} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate">{otherUser.name}</h3>
                            {lastMessage && (
                              <span className="text-xs text-neutral-500">
                                {lastMessage.createdAt ? new Date(lastMessage.createdAt).toLocaleDateString([], {month: 'short', day: 'numeric'}) : ''}
                              </span>
                            )}
                          </div>
                          {lastMessage && (
                            <p className={`text-sm truncate ${unreadCount > 0 ? 'font-medium text-neutral-800' : 'text-neutral-500'}`}>
                              {lastMessage.senderId === user.id ? "You: " : ""}
                              {lastMessage.content}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <div className="bg-primary text-white text-xs font-bold h-5 min-w-5 rounded-full flex items-center justify-center px-1.5">
                              {unreadCount}
                            </div>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button 
                                onClick={(e) => e.stopPropagation()} 
                                className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-neutral-100"
                              >
                                <MoreVertical className="h-4 w-4 text-neutral-500" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewUserProfile(otherUser.id);
                                }}
                                className="cursor-pointer"
                              >
                                <UserCircle className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  muteUserMutation.mutate(otherUser.id);
                                }}
                                className="cursor-pointer"
                              >
                                <BellOff className="h-4 w-4 mr-2" />
                                Mute Notifications
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  blockUserMutation.mutate(otherUser.id);
                                }}
                                className="cursor-pointer text-amber-600"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Block User
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteConversationMutation.mutate(otherUser.id);
                                }}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Conversation
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Conversation Content */}
            <div className="md:w-2/3">
              {selectedUser && (
                <Conversation
                  userId={user.id}
                  otherUserId={selectedUser}
                  otherUser={conversationsData.find(u => u.id === selectedUser)}
                />
              )}
            </div>
          </div>
        )}
      </div>
      
      <AddToyModal
        isOpen={isAddToyModalOpen}
        onClose={() => setIsAddToyModalOpen(false)}
      />
    </div>
  );
}
