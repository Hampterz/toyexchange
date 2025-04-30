import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Send, Loader2, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Message, User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ConversationProps {
  userId: number;
  otherUserId: number;
  otherUser: User | undefined;
}

export function Conversation({ userId, otherUserId, otherUser }: ConversationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get messages between the two users
  const { data: messages, isLoading, refetch } = useQuery<Message[]>({
    queryKey: [`/api/messages/${otherUserId}`],
    enabled: !!otherUserId,
    queryFn: async () => {
      const res = await fetch(`/api/messages/${otherUserId}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }
      return res.json();
    },
    refetchInterval: 1000, // Auto-refetch every 1 second to get new messages
  });

  // Send a new message
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            receiverId: otherUserId,
            content,
            toyId: 0, // This is required by the schema but may not be relevant for direct messages
            read: false
          })
        });
        
        if (!res.ok) {
          throw new Error("Failed to send message");
        }
        
        return await res.json();
      } catch (error) {
        console.error("Message send error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      setNewMessage("");
      // Immediately refetch the messages to show the new message
      // No delay needed anymore since we've reduced the polling interval
      refetch();
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      console.error("Message send error:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: number) => {
      try {
        const res = await apiRequest("DELETE", `/api/messages/${messageId}`);
        return res.ok;
      } catch (error) {
        console.error("Message delete error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Refetch messages after deletion
      refetch();
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      
      toast({
        title: "Message deleted",
        description: "Your message has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      try {
        // Use the apiRequest utility for better error handling
        const response = await apiRequest("PATCH", `/api/messages/${messageId}/read`, { read: true });
        return await response.json();
      } catch (error) {
        console.error("Mark as read error:", error);
        // Don't throw the error, just log it to prevent unhandled promise rejections
        return { success: false, error };
      }
    },
    onSuccess: () => {
      // No delay needed - immediately update the UI
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      console.error("Mark as read error:", error);
      // We'll handle the error silently to prevent disrupting the user experience
    }
  });

  // Mark unread messages as read when conversation is opened
  useEffect(() => {
    if (messages && messages.length > 0) {
      // Use a single-fire effect to avoid infinite loops
      const unreadMessages = messages.filter(message => 
        message.receiverId === userId && !message.read
      );
      
      if (unreadMessages.length > 0) {
        // Process each message with a small delay to avoid overwhelming the server
        unreadMessages.forEach((message, index) => {
          setTimeout(() => {
            try {
              markAsReadMutation.mutate(message.id);
            } catch (error) {
              console.error(`Failed to mark message ${message.id} as read:`, error);
            }
          }, index * 50); // Reduced delay to 50ms between requests
        });
      }
    }
  }, [messages?.length, userId]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col shadow-none border-none">
      <CardHeader className="border-b px-4 py-3 flex-shrink-0 bg-white">
        <div className="flex items-center space-x-3">
          <AvatarWithFallback user={otherUser ?? null} className="border-2 border-blue-100" />
          <div>
            <h3 className="font-medium">{otherUser?.name || "User"}</h3>
            {otherUser?.locationPrivacy === 'exact_location' && (
              <p className="text-xs text-muted-foreground">{otherUser.location}</p>
            )}
            {otherUser?.locationPrivacy === 'city_only' && (
              <p className="text-xs text-muted-foreground">{otherUser.cityName || otherUser.location?.split(',')[0]}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {!messages || messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <p>No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isSentByMe = message.senderId === userId;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isSentByMe && (
                  <div className="mr-2 self-end mb-1">
                    <AvatarWithFallback user={otherUser ?? null} className="h-6 w-6" />
                  </div>
                )}
                <div 
                  className={`max-w-[75%] group relative ${
                    isSentByMe 
                      ? 'bg-primary text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-sm'
                  } px-4 py-2`}
                >
                  {/* Delete button for unread messages sent by current user */}
                  {isSentByMe && !message.read && (
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this message?")) {
                          deleteMessageMutation.mutate(message.id);
                        }
                      }}
                      className="absolute -right-3 -top-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete message"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${isSentByMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    <div className="flex justify-between">
                      <span>
                        {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                      {isSentByMe && (
                        <span className="text-[10px] pl-2">
                          {message.read ? "Read" : "Delivered"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t p-3 bg-white">
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              // Send message on Enter without Shift key
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (newMessage.trim() && !sendMessageMutation.isPending) {
                  handleSendMessage(e);
                }
              }
            }}
            className="flex-1 min-h-[50px] max-h-[100px] border-gray-200 focus-visible:ring-primary resize-none"
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 self-end rounded-full h-10 w-10 p-0 shadow-md"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
