import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
};

export function Header({ onSearchChange, searchValue = "" }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState(searchValue);

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <i className="fas fa-gamepad text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold font-heading text-primary hidden sm:block">ToyShare</span>
          </Link>
        </div>
        
        {/* Search bar */}
        <div className="relative flex-1 max-w-md mx-3">
          <Input
            type="text"
            placeholder="Search toys..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
        </div>
        
        {/* Navigation - desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`text-neutral-700 hover:text-primary font-medium text-sm ${location === '/' ? 'text-primary' : ''}`}>
            Browse
          </Link>
          {user && (
            <>
              <Link href="/favorites" className={`text-neutral-700 hover:text-primary font-medium text-sm ${location === '/favorites' ? 'text-primary' : ''}`}>
                Favorites
              </Link>
              <Link href="/messages" className={`text-neutral-700 hover:text-primary font-medium text-sm ${location === '/messages' ? 'text-primary' : ''}`}>
                Messages
              </Link>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 text-neutral-700 hover:text-primary font-medium text-sm">
                <span>Resources</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/help-center" className="cursor-pointer w-full">Help Center</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/safety-center" className="cursor-pointer w-full">Safety Center</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/resources/community-standards" className="cursor-pointer w-full">Community Standards</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resources/safety-tips" className="cursor-pointer w-full">Safety Tips</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resources/faq" className="cursor-pointer w-full">FAQ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resources/contact-support" className="cursor-pointer w-full">Contact Support</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 flex items-center space-x-1 text-neutral-700 hover:text-primary">
                  <AvatarWithFallback user={user} className="h-8 w-8" />
                  <span className="font-medium text-sm">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full">Your Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full">Your Listings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-neutral-700 focus:outline-none">
          <i className="fas fa-bars text-lg"></i>
        </button>
      </div>
    </header>
  );
}
