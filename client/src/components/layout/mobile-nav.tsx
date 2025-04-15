import { Link, useLocation } from "wouter";
import { Plus, Home, Search, Heart, User } from "lucide-react";

type MobileNavProps = {
  onAddToyClick: () => void;
};

export function MobileNav({ onAddToyClick }: MobileNavProps) {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 shadow-lg z-40">
      <div className="flex items-center justify-around">
        <Link href="/" className={`flex flex-col items-center py-3 px-5 ${location === '/' ? 'text-blue-700' : 'text-blue-400'}`}>
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/" className="flex flex-col items-center py-3 px-5 text-blue-400">
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <button 
          onClick={onAddToyClick}
          className="flex flex-col items-center py-3 px-5 text-blue-400"
        >
          <div className="h-12 w-12 rounded-full bg-blue-700 -mt-5 flex items-center justify-center text-white shadow-md">
            <Plus className="h-5 w-5" />
          </div>
        </button>
        <Link href="/favorites" className={`flex flex-col items-center py-3 px-5 ${location === '/favorites' ? 'text-blue-700' : 'text-blue-400'}`}>
          <Heart className="h-5 w-5" />
          <span className="text-xs mt-1">Favorites</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center py-3 px-5 ${location === '/profile' ? 'text-blue-700' : 'text-blue-400'}`}>
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
}
