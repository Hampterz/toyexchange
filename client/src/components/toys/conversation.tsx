import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Send, Loader2 } from "lucide-react";
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
    refetchInterval: 5000, // Auto-refetch every 5 seconds to get new messages
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
      setTimeout(() => {
        refetch();
        queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
        queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      }, 300);
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

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      try {
        const res = await fetch(`/api/messages/${messageId}/read`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ read: true })
        });
        
        if (!res.ok) {
          throw new Error("Failed to mark message as read");
        }
        
        return await res.json();
      } catch (error) {
        console.error("Mark as read error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Small delay to ensure DB operation completes before refetching
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [`/api/messages/${otherUserId}`] });
        queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      }, 300);
    },
    onError: (error) => {
      console.error("Mark as read error:", error);
    }
  });

  // Mark unread messages as read when conversation is opened
  useEffect(() => {
    if (messages) {
      messages.forEach(message => {
        if (message.receiverId === userId && !message.read) {
          markAsReadMutation.mutate(message.id);
        }
      });
    }
  }, [messages, userId, markAsReadMutation]);

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
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <AvatarWithFallback user={otherUser ?? null} />
          <div>
            <h3 className="font-medium">{otherUser?.name || "User"}</h3>
            <p className="text-xs text-muted-foreground">{otherUser?.location || ""}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
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
                <div className={`max-w-[75%] ${isSentByMe ? 'bg-primary text-white' : 'bg-neutral-100'} rounded-lg px-4 py-2`}>
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${isSentByMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 min-h-[60px] max-h-[120px]"
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 self-end"
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
