import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToyExchangeDialog } from './toy-exchange-dialog';
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface ToyRequestButtonProps {
  toyId: number;
  toyName: string;
  toyOwner: string;
  ownerId: number;
  className?: string;
  isRequested?: boolean;
}

export function ToyRequestButton({
  toyId,
  toyName,
  toyOwner,
  ownerId,
  className = "",
  isRequested = false
}: ToyRequestButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleRequestClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to request toys.",
        variant: "default"
      });
      navigate("/auth");
      return;
    }

    if (user.id === ownerId) {
      toast({
        title: "That's your toy!",
        description: "You can't request your own toys.",
        variant: "default"
      });
      return;
    }

    if (isRequested) {
      toast({
        title: "Already Requested",
        description: "You've already requested this toy. Check your messages for updates.",
        variant: "default"
      });
      return;
    }
    
    // Animate the button before opening the dialog
    setIsButtonAnimating(true);
    setTimeout(() => {
      setIsButtonAnimating(false);
      setIsDialogOpen(true);
    }, 600);
  };

  const handleRequestConfirm = async () => {
    // Simulate a network request with delay
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2500);
    });
  };

  const getButtonClasses = () => {
    let baseClasses = `btn-animated ${className}`;
    
    if (isButtonAnimating) {
      return `${baseClasses} shake`;
    }
    
    if (isRequested) {
      return `${baseClasses} bg-gray-500 hover:bg-gray-600 cursor-not-allowed`;
    }
    
    if (isHovering) {
      return `${baseClasses} pulse-strong bg-blue-600 hover:bg-blue-700`;
    }
    
    return `${baseClasses} bg-blue-600 hover:bg-blue-700`;
  };

  return (
    <>
      <Button
        onClick={handleRequestClick}
        className={getButtonClasses()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        disabled={isRequested || user?.id === ownerId}
      >
        {isRequested ? (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Already Requested
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Request Toy
          </>
        )}
      </Button>

      {/* Exchange Dialog */}
      <ToyExchangeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        toyName={toyName}
        toyOwner={toyOwner}
        onConfirm={handleRequestConfirm}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  );
}