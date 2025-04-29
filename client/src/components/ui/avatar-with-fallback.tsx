import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarWithFallbackProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
};

export function AvatarWithFallback({
  src,
  alt = '',
  className,
  fallbackClassName,
  size = 'md',
}: AvatarWithFallbackProps) {
  // Generate fallback letters from name
  const getFallbackLetters = () => {
    if (!alt) return '?';
    
    const parts = alt.trim().split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return alt.substring(0, 2).toUpperCase();
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src || ''} alt={alt} />
      <AvatarFallback 
        className={cn('bg-primary text-primary-foreground', fallbackClassName)}
      >
        {getFallbackLetters()}
      </AvatarFallback>
    </Avatar>
  );
}