import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Loader2, MessageSquare } from "lucide-react";
import { AddToyModal } from "@/components/toys/add-toy-modal";
import { Conversation } from "@/components/toys/conversation";
import { Button } from "@/components/ui/button";
import { Message, User } from "@shared/schema";

export default function MessagesPage() {
  const { user } = useAuth();
  const [isAddToyModalOpen, setIsAddToyModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  // Get all messages for the current user
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
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
  const { data: conversationsData, isLoading: isLoadingConversations } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      if (!messagesData) return [];
      
      // Extract unique user IDs from messages
      const userIds = new Set<number>();
      messagesData.forEach(message => {
        if (message.senderId !== user?.id) {
          userIds.add(message.senderId);
        }
        if (message.receiverId !== user?.id) {
          userIds.add(message.receiverId);
        }
      });
      
      // Get user details for each unique user
      const userPromises = Array.from(userIds).map(async (userId) => {
        const response = await fetch(`/api/users/${userId}`, {
          credentials: "include",
        });
        return response.json();
      });
      
      return Promise.all(userPromises);
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
      message => message.senderId === userId && message.receiverId === user?.id && !message.read
    ).length;
  };

  // Get the last message for a conversation
  const getLastMessage = (userId: number) => {
    if (!messagesData) return null;
    
    const conversationMessages = messagesData.filter(
      message => 
        (message.senderId === userId && message.receiverId === user?.id) ||
        (message.senderId === user?.id && message.receiverId === userId)
    );
    
    if (conversationMessages.length === 0) return null;
    
    // Sort by date and get the most recent
    return conversationMessages.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
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
    <div className="page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <MessageSquare className="mr-2 h-6 w-6 text-primary" />
          Messages
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !conversationsData || conversationsData.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-lg border border-neutral-200">
            <MessageSquare className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
            <p className="text-neutral-600 mb-6">
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
          <div className="flex flex-col md:flex-row gap-6">
            {/* Conversation List */}
            <div className="md:w-1/3">
              <Card className="overflow-hidden">
                <div className="bg-muted py-3 px-4 border-b">
                  <h2 className="font-semibold">Conversations</h2>
                </div>
                <div className="divide-y">
                  {conversationsData.map((otherUser) => {
                    if (otherUser.id === user.id) return null;
                    
                    const unreadCount = getUnreadCount(otherUser.id);
                    const lastMessage = getLastMessage(otherUser.id);
                    
                    return (
                      <div 
                        key={otherUser.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition hover:scale-[1.01] ${
                          selectedUser === otherUser.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedUser(otherUser.id)}
                      >
                        <div className="flex items-center gap-3">
                          <AvatarWithFallback user={otherUser} />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium truncate">{otherUser.name}</h3>
                              {lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(lastMessage.createdAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {lastMessage && (
                              <p className="text-sm text-muted-foreground truncate">
                                {lastMessage.senderId === user.id ? "You: " : ""}
                                {lastMessage.content}
                              </p>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <div className="bg-primary text-white text-xs font-bold h-5 min-w-5 rounded-full flex items-center justify-center px-1.5">
                              {unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
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
