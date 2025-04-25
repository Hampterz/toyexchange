import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ToyAnimation } from './toy-animation';
import { useToast } from '@/hooks/use-toast';

type ToyExchangeStep = 'request' | 'confirm' | 'success' | 'complete';

interface ToyExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toyName: string;
  toyOwner: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function ToyExchangeDialog({
  open,
  onOpenChange,
  toyName,
  toyOwner,
  onConfirm,
  onCancel
}: ToyExchangeDialogProps) {
  const [step, setStep] = useState<ToyExchangeStep>('request');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Reset the step when dialog opens
  useEffect(() => {
    if (open) {
      setStep('request');
    }
  }, [open]);

  const handleConfirm = async () => {
    setIsLoading(true);
    setStep('confirm');
    
    try {
      await onConfirm();
      setStep('success');
      
      // Generate some confetti when successful
      generateConfetti();
    } catch (error) {
      console.error('Error during toy exchange:', error);
      toast({
        title: "Exchange failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
      setStep('request');
    } finally {
      setIsLoading(false);
    }
  };

  const generateConfetti = () => {
    const confettiContainer = document.querySelector('.confetti-container');
    if (!confettiContainer) return;
    
    const colors = ['#3b82f6', '#22d3ee', '#10b981', '#fbbf24', '#f87171', '#a78bfa'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
      confetti.style.setProperty('--fall-duration', (Math.random() * 3 + 2) + 's');
      confetti.style.setProperty('--fall-delay', (Math.random() * 1.5) + 's');
      confetti.style.left = (Math.random() * 100) + '%';
      
      confettiContainer.appendChild(confetti);
      
      // Remove confetti after animation completes
      setTimeout(() => {
        if (confetti.parentNode === confettiContainer) {
          confettiContainer.removeChild(confetti);
        }
      }, 5000);
    }
  };

  const handleComplete = () => {
    setStep('complete');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="toy-exchange-dialog">
        <div className="confetti-container absolute inset-0 overflow-hidden pointer-events-none z-50"></div>
        
        {step === 'request' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-blue-700 text-2xl font-bold">Request This Toy</DialogTitle>
              <DialogDescription className="text-blue-600">
                You're about to request <span className="font-semibold">{toyName}</span> from {toyOwner}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              <p className="text-gray-600 mb-4">
                When you request this toy:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="bg-blue-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </span>
                  {toyOwner} will be notified of your interest
                </li>
                <li className="flex items-center">
                  <span className="bg-blue-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </span>
                  You can chat to arrange pickup details
                </li>
                <li className="flex items-center">
                  <span className="bg-blue-100 p-1 rounded-full mr-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  {toyOwner} can approve or deny your request
                </li>
              </ul>
            </div>
            
            <DialogFooter className="flex space-x-2 justify-center sm:justify-end">
              <Button variant="outline" onClick={onCancel} className="wobble-hover">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 pulse-strong"
              >
                Request Toy
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'confirm' && (
          <div className="py-6">
            <ToyAnimation type="request" onComplete={() => setStep('success')} />
          </div>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-blue-700 text-2xl font-bold text-center mb-2">
                Request Sent!
                <span className="ml-2 inline-block float">🎉</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-6 sparkle-bg">
              <div className="bg-blue-50 rounded-xl p-4 mb-4 text-center">
                <p className="text-blue-700 font-medium text-lg mb-2">
                  Your request for <span className="font-bold">{toyName}</span> has been sent!
                </p>
                <p className="text-blue-600">
                  We've notified {toyOwner} of your interest.
                </p>
              </div>
              
              <div className="mt-6 space-y-2 text-center">
                <p className="text-gray-600">What happens next?</p>
                <ul className="space-y-3 text-sm text-left mx-auto max-w-sm">
                  <li className="flex items-center">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 float">
                      <span className="text-blue-600">1</span>
                    </div>
                    <span>Check your messages for updates from {toyOwner}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 float">
                      <span className="text-blue-600">2</span>
                    </div>
                    <span>Discuss pickup details when your request is approved</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 float">
                      <span className="text-blue-600">3</span>
                    </div>
                    <span>Meet up to collect the toy and share toy stories!</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleComplete} 
                className="w-full bg-blue-600 hover:bg-blue-700 btn-animated"
              >
                Got it!
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}