import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create handler function to update state
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener for changes
    media.addEventListener("change", listener);
    
    // Clean up function to remove listener
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}