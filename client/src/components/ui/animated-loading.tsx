import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoadingType = 'spinner' | 'dots' | 'bounce' | 'toys' | 'heartbeat';

interface AnimatedLoadingProps {
  type?: LoadingType;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  textClassName?: string;
}

export function AnimatedLoading({
  type = 'spinner',
  size = 'md',
  text,
  className,
  textClassName
}: AnimatedLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const renderSpinner = () => (
    <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size], className)} />
  );

  const renderDots = () => (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className={cn("bg-blue-600 rounded-full animate-bounce", 
           size === 'sm' && 'h-1.5 w-1.5', 
           size === 'md' && 'h-2.5 w-2.5', 
           size === 'lg' && 'h-3.5 w-3.5')} 
           style={{ animationDelay: '0ms' }}></div>
      <div className={cn("bg-blue-600 rounded-full animate-bounce", 
           size === 'sm' && 'h-1.5 w-1.5', 
           size === 'md' && 'h-2.5 w-2.5', 
           size === 'lg' && 'h-3.5 w-3.5')} 
           style={{ animationDelay: '150ms' }}></div>
      <div className={cn("bg-blue-600 rounded-full animate-bounce", 
           size === 'sm' && 'h-1.5 w-1.5', 
           size === 'md' && 'h-2.5 w-2.5', 
           size === 'lg' && 'h-3.5 w-3.5')} 
           style={{ animationDelay: '300ms' }}></div>
    </div>
  );

  const renderBounce = () => (
    <div className={cn("relative", className)}>
      <div className={cn("absolute bg-blue-600 rounded-md animate-bounce opacity-25", 
           size === 'sm' && 'h-4 w-4', 
           size === 'md' && 'h-8 w-8', 
           size === 'lg' && 'h-12 w-12')}></div>
      <div className={cn("relative bg-blue-500 rounded-md animate-bounce", 
           size === 'sm' && 'h-4 w-4', 
           size === 'md' && 'h-8 w-8', 
           size === 'lg' && 'h-12 w-12')} 
           style={{ animationDelay: '100ms' }}></div>
    </div>
  );

  const renderToys = () => (
    <div className={cn("relative", className)}>
      <div className="animate-move-lr">
        <div className={cn("relative bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg transform -rotate-6", 
           size === 'sm' && 'h-5 w-5', 
           size === 'md' && 'h-10 w-10', 
           size === 'lg' && 'h-14 w-14')}>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className={cn("text-white", 
                 size === 'sm' && 'h-3 w-3', 
                 size === 'md' && 'h-6 w-6', 
                 size === 'lg' && 'h-8 w-8')} 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 animate-ping-slow">
          <div className={cn("bg-blue-100 rounded-full", 
               size === 'sm' && 'h-2 w-2', 
               size === 'md' && 'h-3 w-3', 
               size === 'lg' && 'h-4 w-4')}></div>
        </div>
      </div>
    </div>
  );

  const renderHeartbeat = () => (
    <div className={cn("relative", className)}>
      <div className="animate-pulse-strong">
        <svg className={cn("text-red-500", sizeClasses[size])} 
             fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'bounce':
        return renderBounce();
      case 'toys':
        return renderToys();
      case 'heartbeat':
        return renderHeartbeat();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderLoader()}
      {text && <p className={cn("mt-2 text-blue-700", textClassName)}>{text}</p>}
    </div>
  );
}