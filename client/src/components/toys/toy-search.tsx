import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ToySearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function ToySearch({ onSearch, initialValue = "" }: ToySearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  // Update the local state when props change
  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-blue-800">Smart Search</h3>
        <p className="text-xs text-gray-500">Searches toy titles, descriptions & tags</p>
      </div>
      <form 
        onSubmit={handleSubmit} 
        className="relative flex w-full transition-all"
      >
        <Input
          type="text"
          placeholder="Search for car, lego, outdoor toys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-r-none border-r-0 focus-visible:ring-blue-500 pl-4 pr-10 py-2 shadow-sm"
        />
        <Button 
          type="submit" 
          className="rounded-l-none bg-blue-700 hover:bg-blue-800 shadow-sm"
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </form>
    </div>
  );
}