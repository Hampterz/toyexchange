import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Toy, ToyWithDistance } from "@shared/schema";
import { ToyCard } from "./toy-card";
import { RequestToyModal } from "./request-toy-modal";
import { Button } from "@/components/ui/button";

interface ToyListProps {
  filters?: Record<string, any>;
}

export function ToyList({ filters = {} }: ToyListProps) {
  const [selectedToy, setSelectedToy] = useState<ToyWithDistance | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [visibleToys, setVisibleToys] = useState(8); // Initial number of toys to show
  
  // Use filters directly
  const combinedFilters = { ...filters };
  
  // Build query parameters
  const queryParams = Object.entries(combinedFilters)
    .filter(([key, value]) => {
      // Skip empty values and default/all options
      if (value === "" || 
          value === "All Categories" || 
          value === "All Ages" || 
          value === "Any Condition") {
        return false;
      }
      
      // For arrays, only include if they have items
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }

      return true;
    })
    .map(([key, value]) => {
      // Handle array values by creating multiple parameters with same key
      if (Array.isArray(value)) {
        return value.map(v => `${key}[]=${encodeURIComponent(String(v))}`).join('&');
      }
      // Handle single values
      return `${key}=${encodeURIComponent(String(value))}`;
    })
    .join("&");
  
  // Query toys from API
  const { data: toys, isLoading, error } = useQuery<Toy[]>({
    queryKey: [`/api/toys?${queryParams}`],
  });

  const handleRequestClick = (toy: Toy) => {
    setSelectedToy(toy);
    setIsRequestModalOpen(true);
  };

  const handleLoadMore = () => {
    setVisibleToys(prev => prev + 8);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading toys. Please try again later.</p>
      </div>
    );
  }

  if (!toys || toys.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No toys found</h3>
        <p className="text-neutral-600">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  // Only show the specified number of toys
  const displayedToys = toys.slice(0, visibleToys);
  const hasMoreToLoad = toys.length > visibleToys;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {displayedToys.map((toy) => (
          <ToyCard key={toy.id} toy={toy} onRequestClick={handleRequestClick} />
        ))}
      </div>

      {hasMoreToLoad && (
        <div className="flex justify-center mt-6 md:mt-8">
          <Button 
            onClick={handleLoadMore} 
            variant="outline" 
            className="w-full sm:w-auto mx-4 sm:mx-0 border-primary text-primary font-bold rounded-full px-4 py-2 md:px-6 md:py-3 hover:bg-primary hover:text-white"
          >
            Load More Toys
          </Button>
        </div>
      )}

      {selectedToy && (
        <RequestToyModal
          toy={selectedToy}
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      )}
    </>
  );
}
