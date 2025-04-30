import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, X, Bell, Search, Settings, LogOut, 
  HelpCircle, LifeBuoy, Shield, MessageCircle 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToySearch } from "@/components/toys/toy-search";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/layout/logo";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type HeaderProps = {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
};

export function Header({ onSearchChange, searchValue = "" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { toast } = useToast();
  
  // Fetch messages to count unread ones
  const { data: messages } = useQuery({
    queryKey: ['/api/messages'],
    queryFn: async () => {
      if (!user) return [];
      try {
        const response = await apiRequest("GET", "/api/messages");
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        return [];
      }
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds to check for new messages
  });

  // Update unread message count whenever messages change
  useEffect(() => {
    if (messages && user) {
      const unreadCount = messages.filter(
        (message: any) => message.receiverId === user.id && !message.read
      ).length;
      
      setUnreadMessages(unreadCount);
      
      // Show notification for new messages
      if (unreadCount > 0) {
        // Only show notification when count increases
        const shouldNotify = unreadCount > 0 && unreadCount !== unreadMessages;
        if (shouldNotify) {
          toast({
            title: `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`,
            description: "You have new messages waiting for you",
            variant: "default",
            className: "bg-blue-50 border-blue-200",
          });
        }
      }
    }
  }, [messages, user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    // Force reload to ensure session is properly cleared
    window.location.href = "/auth";
  };

  const handleSearch = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Logo />
          </div>

          {onSearchChange && !isMobile && (
            <div className="hidden md:flex items-center mx-2 lg:mx-4 flex-1 max-w-md">
              <ToySearch onSearch={handleSearch} initialValue={searchValue} />
            </div>
          )}

          {/* Mobile sign-in button has been removed */}

          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-blue-700" title="Home">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-blue-700" title="Resources">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/safety-center")}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Safety Center</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/resources/exchange-guide")}>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Exchange Guide</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/help-center")}>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Help Center</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/messages">
                  <Button variant="ghost" size="sm" className="text-blue-700 relative" title="Messages">
                    <MessageCircle className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadMessages}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="ghost" size="sm" className="text-blue-700" title="Favorites">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-700 relative" 
                  title="Notifications"
                  onClick={() => toast({
                    title: "Notifications",
                    description: unreadMessages > 0 
                      ? `You have ${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}`
                      : "No new notifications"
                  })}
                >
                  <Bell className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative p-0 ml-1" size="sm">
                      <AvatarWithFallback
                        user={user}
                        className="h-8 w-8 border-2 border-blue-100"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-xs font-normal text-neutral-600 truncate">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    {user.username === "adminsreyas" && (
                      <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-blue-700">
                    Home
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-blue-700">
                      Resources
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/safety-center")}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Safety Center</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/resources/exchange-guide")}>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Exchange Guide</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/help-center")}>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Help Center</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/auth">
                  <Button variant="default" size="sm" className="bg-blue-700 hover:bg-blue-800">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-neutral-600 p-2"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 space-y-3">
            <div className="py-2 mb-3 border-b">
              <Logo />
            </div>
            {onSearchChange && (
              <div className="relative mt-3 mb-4">
                <ToySearch onSearch={handleSearch} initialValue={searchValue} />
              </div>
            )}
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center p-2 border-b pb-4">
                  <AvatarWithFallback user={user} className="h-8 w-8 mr-3" />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-neutral-600">{user.email}</p>
                  </div>
                </div>
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Home
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start relative"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
                    {unreadMessages > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadMessages}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/favorites">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                    Favorites
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start relative"
                  onClick={() => {
                    toast({
                      title: "Notifications",
                      description: unreadMessages > 0 
                        ? `You have ${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}`
                        : "No new notifications"
                    });
                    setIsMenuOpen(false);
                  }}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                  {unreadMessages > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute top-1 right-20 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
                <Link href="/safety-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Safety Center
                  </Button>
                </Link>
                <Link href="/help-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Help Center
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                {user.username === "adminsreyas" && (
                  <Link href="/admin/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Button>
                </Link>
                <Link href="/safety-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Safety Center
                  </Button>
                </Link>
                <Link href="/help-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Help Center
                  </Button>
                </Link>
                <div className="pt-3 border-t mt-2">
                  <Link href="/auth">
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full bg-blue-700 hover:bg-blue-800 font-semibold shadow-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}