import { useState, useEffect } from "react";
import { MapPin, Baby, Grid, Star, Tag, Search } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  search?: string;
};

export function FilterBar({ onFilterChange, initialFilters }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    location: initialFilters?.location || "any",
    ageRange: initialFilters?.ageRange || "any",
    category: initialFilters?.category || "any",
    condition: initialFilters?.condition || "any",
    tags: initialFilters?.tags || [],
    search: initialFilters?.search || "",
  });
  
  const [searchValue, setSearchValue] = useState(initialFilters?.search || "");

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', searchValue);
  };
  
  return (
    <section className="bg-white shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Search input above the filter bar */}
        <div className="mb-4">
          <form onSubmit={handleSearchSubmit} className="flex relative">
            <Input
              type="text"
              placeholder="Search toys, categories, or tags..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pr-12 focus-visible:ring-blue-500"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1 bottom-1 px-3 bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      
        {/* Desktop view for filters in a row */}
        <div className="hidden md:flex items-center space-x-4">
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

        {/* Mobile view for filters in a grid */}
        <div className="md:hidden grid grid-cols-2 gap-2 w-full max-w-full overflow-hidden">
          <div className="flex items-center space-x-2 bg-blue-50 px-2 py-1.5 rounded-full border border-blue-100 shadow-sm overflow-hidden">
            <MapPin className="text-blue-700 h-3.5 w-3.5 flex-shrink-0" />
            <Select 
              value={filters.location} 
              onValueChange={(value) => handleFilterChange("location", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-xs font-medium text-blue-800 h-7 py-0 px-0 min-w-0 truncate overflow-hidden">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="border-blue-200">
                <SelectItem value="any">Any Location</SelectItem>
                {LOCATIONS.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 bg-blue-50 px-2 py-1.5 rounded-full border border-blue-100 shadow-sm overflow-hidden">
            <Baby className="text-blue-700 h-3.5 w-3.5 flex-shrink-0" />
            <Select 
              value={filters.ageRange} 
              onValueChange={(value) => handleFilterChange("ageRange", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-xs font-medium text-blue-800 h-7 py-0 px-0 min-w-0 truncate overflow-hidden">
                <SelectValue placeholder="Age" />
              </SelectTrigger>
              <SelectContent className="border-blue-200">
                <SelectItem value="any">All Ages</SelectItem>
                {AGE_RANGES.map(ageRange => (
                  <SelectItem key={ageRange} value={ageRange}>{ageRange}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 bg-blue-50 px-2 py-1.5 rounded-full border border-blue-100 shadow-sm overflow-hidden">
            <Grid className="text-blue-700 h-3.5 w-3.5 flex-shrink-0" />
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-xs font-medium text-blue-800 h-7 py-0 px-0 min-w-0 truncate overflow-hidden">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="border-blue-200">
                <SelectItem value="any">All Categories</SelectItem>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 bg-blue-50 px-2 py-1.5 rounded-full border border-blue-100 shadow-sm overflow-hidden">
            <Star className="text-blue-700 h-3.5 w-3.5 flex-shrink-0" />
            <Select 
              value={filters.condition} 
              onValueChange={(value) => handleFilterChange("condition", value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 text-xs font-medium text-blue-800 h-7 py-0 px-0 min-w-0 truncate overflow-hidden">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent className="border-blue-200">
                <SelectItem value="any">Any Condition</SelectItem>
                {CONDITIONS.map(condition => (
                  <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 bg-blue-50 px-2 py-1.5 rounded-full border border-blue-100 shadow-sm col-span-2 overflow-hidden">
            <Tag className="text-blue-700 h-3.5 w-3.5 flex-shrink-0" />
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="link" 
                  className="text-blue-800 font-medium text-xs p-0 pl-0 h-auto truncate"
                >
                  Tags
                  {filters.tags.length > 0 && (
                    <Badge variant="secondary" className="ml-1.5 bg-blue-100 text-blue-800 text-[10px] px-1.5 py-px h-4">
                      {filters.tags.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start">
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
