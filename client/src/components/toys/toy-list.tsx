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
  const { data: toys, isLoading, error } = useQuery<ToyWithDistance[]>({
    queryKey: [`/api/toys?${queryParams}`],
  });

  const handleRequestClick = (toy: ToyWithDistance) => {
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
      <div className="text-center py-12 px-4 sm:px-8 bg-blue-50 rounded-xl shadow-sm">
        <div className="mx-auto max-w-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">No toys found</h3>
          <p className="text-blue-700 mb-4">Try adjusting your filters or search criteria to find more toys in your area.</p>
          <div className="inline-flex items-center justify-center bg-white p-4 rounded-full shadow-sm mb-3">
            <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Only show the specified number of toys
  const displayedToys = toys.slice(0, visibleToys);
  const hasMoreToLoad = toys.length > visibleToys;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
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
