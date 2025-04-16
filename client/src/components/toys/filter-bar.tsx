import { useState, useEffect } from "react";
import { MapPin, Baby, Grid, Star, Tag } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AGE_RANGES, CATEGORIES, CONDITIONS, LOCATIONS } from "@/lib/utils/constants";
import { COMMON_TAGS } from "@shared/schema";

type FilterBarProps = {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
};

export type FilterOptions = {
  location: string;
  ageRange: string;
  category: string;
  condition: string;
  tags: string[];
};

export function FilterBar({ onFilterChange, initialFilters }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    location: initialFilters?.location || "any",
    ageRange: initialFilters?.ageRange || "any",
    category: initialFilters?.category || "any",
    condition: initialFilters?.condition || "any",
    tags: initialFilters?.tags || [],
  });

  // Update filters when a selection changes
  const handleFilterChange = (key: keyof FilterOptions, value: string | string[]) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  // Toggle a tag in the selected tags array
  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    handleFilterChange('tags', newTags);
  };

  // Initialize filters with any provided initial values
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  return (
    <section className="bg-white shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center overflow-x-auto scrollbar-hide space-x-4">
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-100 shadow-sm">
            <MapPin className="text-blue-700 h-4 w-4" />
            <Select 
              value={filters.location} 
              onValueChange={(value) => handleFilterChange("location", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-sm font-medium text-blue-800 min-w-36">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="border-blue-200">
                <SelectItem value="any">Any Location</SelectItem>
                {LOCATIONS.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-100 shadow-sm">
            <Baby className="text-blue-700 h-4 w-4" />
            <Select 
              value={filters.ageRange} 
              onValueChange={(value) => handleFilterChange("ageRange", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-sm font-medium text-blue-800 min-w-32">
                <SelectValue placeholder="All Ages" />
              </SelectTrigger>
              <SelectContent className="border-blue-200">
                <SelectItem value="any">All Ages</SelectItem>
                {AGE_RANGES.map(ageRange => (
                  <SelectItem key={ageRange} value={ageRange}>{ageRange}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-100 shadow-sm">
            <Grid className="text-blue-700 h-4 w-4" />
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-sm font-medium text-blue-800 min-w-36">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="border-blue-200">
                <SelectItem value="any">All Categories</SelectItem>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-100 shadow-sm">
            <Star className="text-blue-700 h-4 w-4" />
            <Select 
              value={filters.condition} 
              onValueChange={(value) => handleFilterChange("condition", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-sm font-medium text-blue-800 min-w-36">
                <SelectValue placeholder="Any Condition" />
              </SelectTrigger>
              <SelectContent className="border-blue-200">
                <SelectItem value="any">Any Condition</SelectItem>
                {CONDITIONS.map(condition => (
                  <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full border border-blue-100 shadow-sm">
            <Tag className="text-blue-700 h-4 w-4" />
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="link" 
                  className="text-blue-800 font-medium text-sm pl-0"
                >
                  Tags
                  {filters.tags.length > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                      {filters.tags.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-2">Filter by tags</h4>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {COMMON_TAGS.map(tag => (
                      <Badge
                        key={tag}
                        variant={filters.tags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.tags.includes(tag) 
                            ? 'bg-primary hover:bg-primary/80' 
                            : 'hover:bg-muted/80'
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  {filters.tags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleFilterChange('tags', [])}
                    >
                      Clear all tags
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </section>
  );
}
