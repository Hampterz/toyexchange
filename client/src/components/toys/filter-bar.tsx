import { useState, useEffect } from "react";
import { MapPin, Baby, Grid, Star, Tag, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AGE_RANGES, CATEGORIES, CONDITIONS, LOCATIONS } from "@/lib/utils/constants";
import { COMMON_TAGS } from "@shared/schema";
import { useMediaQuery } from "../../hooks/use-media-query";

type FilterBarProps = {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
};

export type FilterOptions = {
  location: string[];
  ageRange: string[];
  category: string[];
  condition: string[];
  tags: string[];
  search?: string;
};

export function FilterBar({ onFilterChange, initialFilters }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    location: initialFilters?.location || [],
    ageRange: initialFilters?.ageRange || [],
    category: initialFilters?.category || [],
    condition: initialFilters?.condition || [],
    tags: initialFilters?.tags || [],
    search: initialFilters?.search || "",
  });
  
  const [searchValue, setSearchValue] = useState(initialFilters?.search || "");
  
  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

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
  
  // Handle multi-select in mobile dropdown
  const handleMultiSelectChange = (filterType: keyof FilterOptions, value: string) => {
    const currentValues = filters[filterType] as string[];
    
    if (currentValues.includes(value)) {
      // If already selected, remove it
      const updatedValues = currentValues.filter(v => v !== value);
      handleFilterChange(filterType, updatedValues);
    } else {
      // Otherwise add it
      const updatedValues = [...currentValues, value];
      handleFilterChange(filterType, updatedValues);
    }
  };

  // Format selected values for display in a multi-select dropdown
  const formatSelectedValues = (filterType: keyof FilterOptions): string => {
    const selectedValues = filters[filterType] as string[];
    if (selectedValues.length === 0) return "Select...";
    if (selectedValues.length === 1) return selectedValues[0];
    return `${selectedValues.length} selected`;
  };
  
  if (isMobile) {
    // Mobile version - compact dropdowns
    return (
      <div className="space-y-3 mb-4">
        {/* Categories Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between text-left font-normal"
            >
              <div className="flex items-center">
                <Grid className="mr-2 h-4 w-4 shrink-0" />
                <span>Categories ({filters.category.length || 0})</span>
              </div>
              <span className="opacity-70">{filters.category.length > 0 ? `${filters.category.length} selected` : ""}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="max-h-60 overflow-auto p-2">
              {CATEGORIES.map(category => (
                <div 
                  key={category}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => handleMultiSelectChange("category", category)}
                >
                  <input 
                    type="checkbox" 
                    checked={filters.category.includes(category)}
                    readOnly
                    className="h-4 w-4 mr-2 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500 checkbox-pop cursor-pointer transform transition-transform duration-200 hover:scale-110"
                  />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Age Range Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between text-left font-normal"
            >
              <div className="flex items-center">
                <Baby className="mr-2 h-4 w-4 shrink-0" />
                <span>Age Range ({filters.ageRange.length || 0})</span>
              </div>
              <span className="opacity-70">{filters.ageRange.length > 0 ? `${filters.ageRange.length} selected` : ""}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="max-h-60 overflow-auto p-2">
              {AGE_RANGES.map(age => (
                <div 
                  key={age}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => handleMultiSelectChange("ageRange", age)}
                >
                  <input 
                    type="checkbox" 
                    checked={filters.ageRange.includes(age)}
                    readOnly
                    className="h-4 w-4 mr-2 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500"
                  />
                  <span>{age}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Location Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between text-left font-normal"
            >
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 shrink-0" />
                <span>Location ({filters.location.length || 0})</span>
              </div>
              <span className="opacity-70">{filters.location.length > 0 ? `${filters.location.length} selected` : ""}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="max-h-60 overflow-auto p-2">
              {LOCATIONS.map(location => (
                <div 
                  key={location}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => handleMultiSelectChange("location", location)}
                >
                  <input 
                    type="checkbox" 
                    checked={filters.location.includes(location)}
                    readOnly
                    className="h-4 w-4 mr-2 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500"
                  />
                  <span>{location}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Condition Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between text-left font-normal"
            >
              <div className="flex items-center">
                <Star className="mr-2 h-4 w-4 shrink-0" />
                <span>Condition ({filters.condition.length || 0})</span>
              </div>
              <span className="opacity-70">{filters.condition.length > 0 ? `${filters.condition.length} selected` : ""}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="max-h-60 overflow-auto p-2">
              {CONDITIONS.map(condition => (
                <div 
                  key={condition}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => handleMultiSelectChange("condition", condition)}
                >
                  <input 
                    type="checkbox" 
                    checked={filters.condition.includes(condition)}
                    readOnly
                    className="h-4 w-4 mr-2 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500"
                  />
                  <span>{condition}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Tags Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between text-left font-normal"
            >
              <div className="flex items-center">
                <Tag className="mr-2 h-4 w-4 shrink-0" />
                <span>Tags ({filters.tags.length || 0})</span>
              </div>
              <span className="opacity-70">{filters.tags.length > 0 ? `${filters.tags.length} selected` : ""}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="max-h-60 overflow-auto p-2">
              {COMMON_TAGS.map(tag => (
                <div 
                  key={tag}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => toggleTag(tag)}
                >
                  <input 
                    type="checkbox" 
                    checked={filters.tags.includes(tag)}
                    readOnly
                    className="h-4 w-4 mr-2 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500"
                  />
                  <span>#{tag}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Clear all filters (show only if some filters are active) */}
        {(filters.category.length > 0 || 
          filters.ageRange.length > 0 || 
          filters.condition.length > 0 || 
          filters.location.length > 0 || 
          filters.tags.length > 0) && (
          <Button 
            variant="outline"
            onClick={() => {
              setFilters({
                ...filters,
                category: [],
                ageRange: [],
                condition: [],
                location: [],
                tags: []
              });
              onFilterChange({
                ...filters,
                category: [],
                ageRange: [],
                condition: [],
                location: [],
                tags: []
              });
            }}
            className="w-full mb-3"
          >
            Clear All Filters
          </Button>
        )}

        <Button 
          onClick={() => {
            // Apply filters button
            onFilterChange(filters);
          }}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white mt-4"
        >
          Apply Filters
        </Button>
      </div>
    );
  }
  
  // Desktop version - checkboxes and badge tags
  return (
    <div>
      {/* Category Filters */}
      <div className="mb-6">
        <h3 className="text-sm text-neutral-600 font-medium mb-2 border-b pb-1">Categories</h3>
        <div className="space-y-2 mt-3">
          {CATEGORIES.map(category => (
            <label key={category} className="flex items-center">
              <input 
                type="checkbox" 
                checked={filters.category.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.category, category]
                    : filters.category.filter(c => c !== category);
                  handleFilterChange("category", newCategories);
                }}
                className="h-4 w-4 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-blue-800">{category}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Age Range Filters */}
      <div className="mb-6">
        <h3 className="text-sm text-neutral-600 font-medium mb-2 border-b pb-1">Age Range</h3>
        <div className="space-y-2 mt-3">
          {AGE_RANGES.map(age => (
            <label key={age} className="flex items-center">
              <input 
                type="checkbox" 
                checked={filters.ageRange.includes(age)}
                onChange={(e) => {
                  const newAgeRanges = e.target.checked
                    ? [...filters.ageRange, age]
                    : filters.ageRange.filter(a => a !== age);
                  handleFilterChange("ageRange", newAgeRanges);
                }}
                className="h-4 w-4 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-blue-800">{age}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Location Filters */}
      <div className="mb-6">
        <h3 className="text-sm text-neutral-600 font-medium mb-2 border-b pb-1">Location</h3>
        <div className="space-y-2 mt-3">
          {LOCATIONS.map(location => (
            <label key={location} className="flex items-center">
              <input 
                type="checkbox" 
                checked={filters.location.includes(location)}
                onChange={(e) => {
                  const newLocations = e.target.checked
                    ? [...filters.location, location]
                    : filters.location.filter(l => l !== location);
                  handleFilterChange("location", newLocations);
                }}
                className="h-4 w-4 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-blue-800">{location}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Condition Filters */}
      <div className="mb-6">
        <h3 className="text-sm text-neutral-600 font-medium mb-2 border-b pb-1">Condition</h3>
        <div className="space-y-2 mt-3">
          {CONDITIONS.map(condition => (
            <label key={condition} className="flex items-center">
              <input 
                type="checkbox" 
                checked={filters.condition.includes(condition)}
                onChange={(e) => {
                  const newConditions = e.target.checked
                    ? [...filters.condition, condition]
                    : filters.condition.filter(c => c !== condition);
                  handleFilterChange("condition", newConditions);
                }}
                className="h-4 w-4 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-blue-800">{condition}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Tags */}
      <div className="mb-6">
        <h3 className="text-sm text-neutral-600 font-medium mb-2 border-b pb-1">Tags</h3>
        <div className="flex flex-wrap gap-2 mt-3">
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
      
      {/* Clear all filters (show only if some filters are active) */}
      {(filters.category.length > 0 || 
        filters.ageRange.length > 0 || 
        filters.condition.length > 0 || 
        filters.location.length > 0 || 
        filters.tags.length > 0) && (
        <Button 
          variant="outline"
          onClick={() => {
            setFilters({
              ...filters,
              category: [],
              ageRange: [],
              condition: [],
              location: [],
              tags: []
            });
            onFilterChange({
              ...filters,
              category: [],
              ageRange: [],
              condition: [],
              location: [],
              tags: []
            });
          }}
          className="w-full mb-3"
        >
          Clear All Filters
        </Button>
      )}

      <Button 
        onClick={() => {
          // Apply filters button
          onFilterChange(filters);
        }}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white mt-4"
      >
        Apply Filters
      </Button>
    </div>
  );
}