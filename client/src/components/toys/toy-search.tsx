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
      <form 
        onSubmit={handleSubmit} 
        className="relative flex w-full transition-all"
      >
        <Input
          type="text"
          placeholder="Search toys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-r-none border-r-0 focus-visible:ring-blue-500 pl-4 py-2 shadow-sm text-sm"
          aria-label="Search for toys"
          autoComplete="off"
          spellCheck="false"
        />
        <Button 
          type="submit" 
          className="rounded-l-none bg-blue-700 hover:bg-blue-800 shadow-sm px-3"
          aria-label="Search for toys"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
      {/* Removed the description text as requested */}
    </div>
  );
}