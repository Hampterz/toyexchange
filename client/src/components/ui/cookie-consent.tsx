import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./button";
import { Link } from "wouter";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookie-consent");
    if (!hasConsented) {
      // Show the banner after a slight delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white shadow-lg border-t border-gray-200 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 pr-8">
          <h3 className="text-lg font-bold text-blue-800 mb-2">We value your privacy</h3>
          <p className="text-sm text-gray-600 mb-2">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
            By clicking "Accept All", you consent to our use of cookies.
          </p>
          <div className="text-xs text-gray-500">
            <Link href="/legal/cookie-policy" className="text-blue-600 hover:underline">
              Learn more about our cookie policy
            </Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDecline}
            className="text-sm border-blue-200 text-blue-800"
          >
            Decline
          </Button>
          <Button 
            size="sm" 
            onClick={handleAccept}
            className="text-sm bg-blue-700 hover:bg-blue-800 text-white"
          >
            Accept All
          </Button>
        </div>
        <button 
          onClick={handleDecline} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}