import { useState, useEffect } from "react";
import { MapPin, Baby, Grid, Star, Tag, Search, Ruler, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AGE_RANGES, CONDITIONS, LOCATIONS } from "@/lib/utils/constants";
import { COMMON_ATTRIBUTES } from "@shared/schema";
import { useMediaQuery } from "../../hooks/use-media-query";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/use-auth";

type FilterBarProps = {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
};

export type FilterOptions = {
  location: string[];
  ageRange: string[];
  condition: string[];
  tags: string[];
  search?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
};

export function FilterBar({ onFilterChange, initialFilters }: FilterBarProps) {
  // Get user info for location
  const { user } = useAuth();
  
  const [filters, setFilters] = useState<FilterOptions>({
    location: initialFilters?.location || [],
    ageRange: initialFilters?.ageRange || [],
    condition: initialFilters?.condition || [],
    tags: initialFilters?.tags || [],
    search: initialFilters?.search || "",
    distance: initialFilters?.distance || 10, // Default to 10 miles
    // Ensure coordinates are properly converted to numbers
    latitude: initialFilters?.latitude || (user?.latitude ? Number(user.latitude) : undefined),
    longitude: initialFilters?.longitude || (user?.longitude ? Number(user.longitude) : undefined),
  });
  
  const [searchValue, setSearchValue] = useState(initialFilters?.search || "");
  
  // Automatically populate user location when component loads
  useEffect(() => {
    // If user is logged in, has location info, and no location filter is already set
    if (user?.location && user?.latitude && user?.longitude && 
        !filters.location.length && !initialFilters?.location?.length) {
      
      console.log("Setting user location from profile:", user.location);
      
      // User has a location but no location filter is applied yet
      const newFilters = { 
        ...filters, 
        location: [user.location],
        // Ensure latitude and longitude are converted to numbers
        latitude: typeof user.latitude === 'string' ? parseFloat(user.latitude) : user.latitude,
        longitude: typeof user.longitude === 'string' ? parseFloat(user.longitude) : user.longitude,
        distance: filters.distance || 10 // Default to 10 miles
      };
      
      setFilters(newFilters);
      
      // Always apply filter when we have user location
      onFilterChange(newFilters);
      console.log(`Applied user location with coordinates [${newFilters.latitude}, ${newFilters.longitude}]`);
    }
    // If initialFilters already has location info, ensure coordinates are properly set
    else if (initialFilters?.location?.length && initialFilters.latitude && initialFilters.longitude) {
      // Already has location in initialFilters, just ensure it's properly formatted
      console.log("Using initial location filters:", initialFilters.location);
      console.log(`With coordinates [${initialFilters.latitude}, ${initialFilters.longitude}]`);
    }
  }, [user]);
  
  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Update filters when a selection changes
  const handleFilterChange = (key: keyof FilterOptions, value: string | string[] | number) => {
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
  
  // Handle location removal with special logic for coordinates
  const handleLocationRemove = (locationToRemove: string) => {
    const newLocations = filters.location.filter(l => l !== locationToRemove);
    
    // If removing the last location, also clear coordinates
    if (newLocations.length === 0) {
      const updatedFilters = {
        ...filters,
        location: newLocations,
        latitude: undefined,
        longitude: undefined
      };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
      console.log("Cleared location coordinates");
    } else {
      // Otherwise just update the location list
      handleFilterChange("location", newLocations);
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
        {/* Direct Location Search - Moved to top */}
        <div className="mb-3">
          <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2 mb-2 shadow-sm">
            <MapPin className="mr-2 h-4 w-4 shrink-0 text-blue-600" />
            <AddressAutocomplete
              placeholder="Search for location..."
              defaultValue=""
              className="w-full border-none focus-visible:ring-0 p-0 shadow-none"
              onAddressSelect={(address, coordinates, placeId) => {
                // Only proceed if we have an address and coordinates
                if (address && coordinates) {
                  console.log("Location selected:", address, coordinates);
                  
                  // Add to the existing locations array instead of replacing
                  const newLocations = [...filters.location];
                  
                  // Only add if it's not already in the list
                  if (!newLocations.includes(address)) {
                    newLocations.push(address);
                  }
                  
                  // Always use coordinates for radius-based filtering
                  // Ensure coordinates are converted to numbers
                  const lat = Number(coordinates.latitude);
                  const lng = Number(coordinates.longitude);
                  
                  console.log(`Using coordinates for radius filtering: [${lat}, ${lng}]`);
                  
                  // Apply all filter changes at once for better performance
                  const updatedFilters = {
                    ...filters,
                    location: newLocations,
                    latitude: lat,
                    longitude: lng,
                    distance: filters.distance || 10 // Keep existing distance or use 10 miles default
                  };
                  
                  // Update state and apply filter
                  setFilters(updatedFilters);
                  onFilterChange(updatedFilters);
                  
                  // Clear the input field after selection for better UX
                  const inputEl = document.querySelector('.address-autocomplete-input') as HTMLInputElement;
                  if (inputEl) {
                    inputEl.value = '';
                  }
                } else {
                  console.log("Missing coordinates for location:", address);
                }
              }}
            />
          </div>
          
          {/* Distance slider - directly visible */}
          <div className="mt-3 mb-3 px-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-blue-700">Radius</h4>
              <span className="text-xs font-medium text-blue-700">{filters.distance || 10} miles</span>
            </div>
            <Slider
              value={[filters.distance || 10]}
              min={1}
              max={100}
              step={1}
              className="mt-1"
              onValueChange={(value) => {
                handleFilterChange("distance", value[0]);
                // Apply filter immediately to improve UX
                if (filters.latitude && filters.longitude) {
                  onFilterChange({...filters, distance: value[0]});
                }
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 mi</span>
              <span>50 mi</span>
              <span>100 mi</span>
            </div>
          </div>
          
          {/* Selected Locations */}
          {filters.location.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {filters.location.map(location => (
                  <Badge 
                    key={location} 
                    variant="secondary"
                    className="flex items-center gap-1 py-1.5 px-2.5 mb-1 bg-blue-100 border border-blue-200 shadow-sm"
                  >
                    <MapPin className="h-3 w-3 text-blue-700 mr-1" />
                    <span className="text-xs font-medium text-blue-700 max-w-[150px] truncate">{location}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocationRemove(location);
                      }}
                      className="text-blue-500 hover:text-blue-700 ml-1"
                      aria-label="Remove location"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
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
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] md:w-[450px] p-0">
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
                    className="h-4 w-4 mr-2 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500 checkbox-pop cursor-pointer transform transition-transform duration-200 hover:scale-110"
                  />
                  <span>{age}</span>
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
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] md:w-[450px] p-0">
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
                    className="h-4 w-4 mr-2 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500 checkbox-pop cursor-pointer transform transition-transform duration-200 hover:scale-110"
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
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] md:w-[450px] p-0">
            <div className="max-h-60 overflow-auto p-2">
              {COMMON_ATTRIBUTES.map(tag => (
                <div 
                  key={tag}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => toggleTag(tag)}
                >
                  <input 
                    type="checkbox" 
                    checked={filters.tags.includes(tag)}
                    readOnly
                    className="h-4 w-4 mr-2 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500 checkbox-pop cursor-pointer transform transition-transform duration-200 hover:scale-110"
                  />
                  <span>#{tag}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Clear all filters (show only if some filters are active) */}
        {(filters.ageRange.length > 0 || 
          filters.condition.length > 0 || 
          filters.location.length > 0 || 
          filters.tags.length > 0) && (
          <Button 
            variant="outline"
            onClick={() => {
              const updatedFilters = {
                ...filters,
                ageRange: [],
                condition: [],
                location: [],
                tags: [],
                // Also clear coordinates when clearing all filters
                latitude: undefined,
                longitude: undefined
              };
              setFilters(updatedFilters);
              onFilterChange(updatedFilters);
              console.log("Cleared all filters including coordinates");
            }}
            className="w-full mb-3 transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md"
          >
            Clear All Filters
          </Button>
        )}

        <Button 
          onClick={() => {
            // Apply filters button
            onFilterChange(filters);
          }}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white mt-4 transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md"
        >
          Apply Filters
        </Button>
      </div>
    );
  }
  
  // Desktop version - checkboxes and badge tags
  return (
    <div>
      {/* Location Filters - Moved to top */}
      <div className="mb-6">
        <h3 className="text-sm text-neutral-600 font-medium mb-2 border-b pb-1">Location</h3>
        
        {/* Google Maps Address Autocomplete */}
        <div className="mb-3">
          <AddressAutocomplete
            placeholder="Search for location..."
            defaultValue=""
            className="w-full mb-2 border border-gray-300 rounded-md py-2 px-3"
            onAddressSelect={(address, coordinates, placeId) => {
              // Only proceed if we have an address and coordinates
              if (address && coordinates) {
                console.log("Location selected:", address, coordinates);
                
                // Add to the existing locations array instead of replacing
                const newLocations = [...filters.location];
                
                // Only add if it's not already in the list
                if (!newLocations.includes(address)) {
                  newLocations.push(address);
                }
                
                // Always use coordinates for radius-based filtering
                // Ensure coordinates are converted to numbers
                const lat = Number(coordinates.latitude);
                const lng = Number(coordinates.longitude);
                
                console.log(`Using coordinates for radius filtering: [${lat}, ${lng}]`);
                
                // Apply all filter changes at once for better performance
                const updatedFilters = {
                  ...filters,
                  location: newLocations,
                  latitude: lat,
                  longitude: lng,
                  distance: filters.distance || 5 // Keep existing distance or use 5 miles default
                };
                
                // Update state and apply filter
                setFilters(updatedFilters);
                onFilterChange(updatedFilters);
                
                // Clear the input field after selection for better UX
                const inputEl = document.querySelector('.address-autocomplete-input') as HTMLInputElement;
                if (inputEl) {
                  inputEl.value = '';
                }
              } else {
                console.log("Missing coordinates for location:", address);
              }
            }}
          />
          
          {/* Selected locations */}
          {filters.location.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {filters.location.map(location => (
                  <Badge 
                    key={location} 
                    variant="secondary"
                    className="flex items-center gap-1 py-1.5 px-2.5 mb-1 bg-blue-100 border border-blue-200 shadow-sm max-w-full"
                  >
                    <MapPin className="h-3 w-3 text-blue-700 mr-1 flex-shrink-0" />
                    <span className="text-xs font-medium text-blue-700 max-w-[90%] truncate">{location}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLocationRemove(location);
                      }}
                      className="text-blue-500 hover:text-blue-700 ml-1 flex-shrink-0"
                      aria-label="Remove location"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Distance slider */}
        <div className="mt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-700">Radius</h4>
            <span className="text-sm font-medium text-blue-700">
              {filters.distance || 10} <span className="hidden xs:inline">miles</span><span className="xs:hidden">m</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-blue-600" />
            <Slider
              value={[filters.distance || 10]}
              min={1}
              max={100}
              step={1}
              className="flex-1"
              onValueChange={(value) => {
                handleFilterChange("distance", value[0]);
                // Apply filter immediately to improve UX
                if (filters.latitude && filters.longitude) {
                  onFilterChange({...filters, distance: value[0]});
                }
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span className="hidden xs:inline">1 mile</span>
            <span className="xs:hidden">1m</span>
            <span className="hidden xs:inline">50 miles</span>
            <span className="xs:hidden">50m</span>
            <span className="hidden xs:inline">100 miles</span>
            <span className="xs:hidden">100m</span>
          </div>
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
                className="h-4 w-4 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500 checkbox-pop cursor-pointer transform transition-transform duration-200 hover:scale-110"
              />
              <span className="ml-2 text-sm text-blue-800">{age}</span>
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
                className="h-4 w-4 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500 checkbox-pop cursor-pointer transform transition-transform duration-200 hover:scale-110"
              />
              <span className="ml-2 text-sm text-blue-800">{condition}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Tags Filter - Converted to Dropdown */}
      <div className="mb-6">
        <h3 className="text-sm text-neutral-600 font-medium mb-2 border-b pb-1">Tags</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between text-left font-normal"
            >
              <div className="flex items-center">
                <Tag className="mr-2 h-4 w-4 shrink-0" />
                <span>Select Tags ({filters.tags.length || 0})</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] md:w-[450px] p-0">
            <div className="max-h-60 overflow-auto p-2">
              {COMMON_ATTRIBUTES.map(tag => (
                <div 
                  key={tag}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => toggleTag(tag)}
                >
                  <input 
                    type="checkbox" 
                    checked={filters.tags.includes(tag)}
                    readOnly
                    className="h-4 w-4 mr-2 text-blue-700 border-blue-300 rounded-full focus:ring-blue-500 checkbox-pop cursor-pointer transform transition-transform duration-200 hover:scale-110"
                  />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Show selected tags and allow removal */}
        {filters.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="default"
                className="cursor-pointer py-1 px-2 transition-all bg-blue-100 text-blue-800 hover:bg-blue-200 max-w-full"
                onClick={() => toggleTag(tag)}
              >
                <span className="truncate">#{tag}</span> <X className="ml-1 h-3 w-3 flex-shrink-0" />
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {/* Clear all filters (show only if some filters are active) */}
      {(filters.ageRange.length > 0 || 
        filters.condition.length > 0 || 
        filters.location.length > 0 || 
        filters.tags.length > 0 || 
        (filters.search && filters.search.length > 0)) && (
        <Button 
          variant="outline"
          onClick={() => {
            const updatedFilters = {
              ...filters,
              ageRange: [],
              condition: [],
              location: [],
              tags: [],
              search: "",
              // Also clear coordinates when clearing all filters
              latitude: undefined,
              longitude: undefined
            };
            setSearchValue("");
            setFilters(updatedFilters);
            onFilterChange(updatedFilters);
            console.log("Cleared all filters including coordinates");
          }}
          className="w-full mb-3 transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md border border-red-300 text-red-600 hover:bg-red-50"
        >
          Clear All Filters
        </Button>
      )}
      
      <Button 
        onClick={() => {
          // Apply filters button
          onFilterChange(filters);
        }}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white mt-2 transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md"
      >
        Apply Filters
      </Button>
    </div>
  );
}