import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ToyCard } from "@/components/toys/toy-card";
import { RequestToyModal } from "@/components/toys/request-toy-modal";
import { AddToyModal } from "@/components/toys/add-toy-modal";
import { useAuth } from "@/hooks/use-auth";
import { Toy } from "@shared/schema";
import { Loader2, Search, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [selectedToy, setSelectedToy] = useState<Toy | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAddToyModalOpen, setIsAddToyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Query favorites from API
  const { data: favoritesData, isLoading, error } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  const handleRequestClick = (toy: Toy) => {
    setSelectedToy(toy);
    setIsRequestModalOpen(true);
  };

  // Filter toys based on search query
  const filteredFavorites = favoritesData?.filter(fav => 
    fav.toy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.toy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">Error loading favorites. Please try again later.</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Heart className="text-primary mr-2 h-6 w-6" />
              <h1 className="text-2xl font-bold">Your Favorite Toys</h1>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search your favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
              </div>
            </div>
          </div>

          {!favoritesData || favoritesData.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-lg border border-neutral-200">
              <Heart className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-neutral-600 mb-6">
                When you find toys you like, save them to your favorites for quick access later
              </p>
              <Button 
                onClick={() => window.location.href = "/"} 
                className="bg-primary hover:bg-primary/90"
              >
                Browse Toys
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFavorites && filteredFavorites.map((favorite) => (
                <ToyCard
                  key={favorite.id}
                  toy={favorite.toy}
                  onRequestClick={handleRequestClick}
                />
              ))}
            </div>
          )}

          {filteredFavorites && filteredFavorites.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p>No matching favorites found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav onAddToyClick={() => setIsAddToyModalOpen(true)} />
      
      {selectedToy && (
        <RequestToyModal
          toy={selectedToy}
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      )}
      
      <AddToyModal
        isOpen={isAddToyModalOpen}
        onClose={() => setIsAddToyModalOpen(false)}
      />
    </div>
  );
}
