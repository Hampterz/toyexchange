import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ToyAnimationType = 'request' | 'transfer' | 'accept' | 'cancel';

interface ToyAnimationProps {
  type: ToyAnimationType;
  onComplete?: () => void;
  duration?: number; // in milliseconds
  className?: string;
}

export function ToyAnimation({ 
  type, 
  onComplete, 
  duration = 3000, 
  className 
}: ToyAnimationProps) {
  const [stage, setStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage < getStageCount(type) - 1) {
        setStage(stage + 1);
      } else {
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, duration / getStageCount(type));
    
    return () => clearTimeout(timer);
  }, [stage, type, duration, onComplete]);
  
  const getStageCount = (type: ToyAnimationType): number => {
    switch (type) {
      case 'request': return 3; // Request stages: Message, Processing, Confirmation
      case 'transfer': return 4; // Transfer stages: Start, Pickup, Moving, Delivered
      case 'accept': return 3; // Accept stages: Review, Approval, Completion
      case 'cancel': return 2; // Cancel stages: Review, Confirmation
      default: return 3;
    }
  };
  
  const renderAnimation = () => {
    switch (type) {
      case 'request':
        return <RequestAnimation stage={stage} />;
      case 'transfer':
        return <TransferAnimation stage={stage} />;
      case 'accept':
        return <AcceptAnimation stage={stage} />;
      case 'cancel':
        return <CancelAnimation stage={stage} />;
      default:
        return <RequestAnimation stage={stage} />;
    }
  };
  
  return (
    <div className={cn("flex flex-col items-center justify-center p-6", className)}>
      {!isComplete ? (
        renderAnimation()
      ) : (
        <div className="text-center">
          <div className="text-green-500 mb-2 animate-bounce">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium text-lg">
            {type === 'request' && 'Request Sent!'}
            {type === 'transfer' && 'Toy Transfer Complete!'}
            {type === 'accept' && 'Request Accepted!'}
            {type === 'cancel' && 'Request Cancelled!'}
          </p>
        </div>
      )}
    </div>
  );
}

// Request Animation Component
function RequestAnimation({ stage }: { stage: number }) {
  return (
    <div className="text-center">
      {stage === 0 && (
        <div className="animate-pulse">
          <div className="bg-blue-100 p-4 rounded-lg mb-3">
            <svg className="w-12 h-12 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium">Composing request message...</p>
        </div>
      )}
      
      {stage === 1 && (
        <div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-blue-800 font-medium">Processing your request...</p>
        </div>
      )}
      
      {stage === 2 && (
        <div className="animate-bounce">
          <div className="bg-blue-100 p-4 rounded-lg mb-3">
            <svg className="w-12 h-12 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium">Almost there!</p>
        </div>
      )}
    </div>
  );
}

// Transfer Animation Component
function TransferAnimation({ stage }: { stage: number }) {
  return (
    <div className="text-center">
      {stage === 0 && (
        <div className="animate-pulse">
          <div className="bg-blue-100 p-4 rounded-lg mb-3">
            <svg className="w-12 h-12 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium">Preparing your toy for its journey...</p>
        </div>
      )}
      
      {stage === 1 && (
        <div className="transition-all duration-500">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <div className="absolute top-2 right-1/3 animate-ping-slow w-4 h-4 rounded-full bg-blue-500 opacity-75"></div>
          </div>
          <p className="text-blue-800 font-medium">Toy is being picked up...</p>
        </div>
      )}
      
      {stage === 2 && (
        <div className="transition-all duration-500">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-3 rounded-lg transform -rotate-6 animate-move-lr">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-blue-800 font-medium">Toy is on its way...</p>
        </div>
      )}
      
      {stage === 3 && (
        <div className="animate-bounce">
          <div className="bg-blue-100 p-4 rounded-lg mb-3">
            <svg className="w-12 h-12 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium">Arriving at its new home!</p>
        </div>
      )}
    </div>
  );
}

// Accept Animation Component
function AcceptAnimation({ stage }: { stage: number }) {
  return (
    <div className="text-center">
      {stage === 0 && (
        <div className="animate-pulse">
          <div className="bg-blue-100 p-4 rounded-lg mb-3">
            <svg className="w-12 h-12 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium">Reviewing request details...</p>
        </div>
      )}
      
      {stage === 1 && (
        <div>
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="text-blue-800 font-medium">Approving request...</p>
        </div>
      )}
      
      {stage === 2 && (
        <div className="animate-bounce">
          <div className="bg-green-100 p-4 rounded-lg mb-3">
            <svg className="w-12 h-12 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium">Success! Preparing to meet...</p>
        </div>
      )}
    </div>
  );
}

// Cancel Animation Component
function CancelAnimation({ stage }: { stage: number }) {
  return (
    <div className="text-center">
      {stage === 0 && (
        <div className="animate-pulse">
          <div className="bg-red-100 p-4 rounded-lg mb-3">
            <svg className="w-12 h-12 mx-auto text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium">Processing cancellation...</p>
        </div>
      )}
      
      {stage === 1 && (
        <div className="animate-bounce">
          <div className="bg-blue-100 p-4 rounded-lg mb-3">
            <svg className="w-12 h-12 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium">Finalizing cancellation...</p>
        </div>
      )}
    </div>
  );
}