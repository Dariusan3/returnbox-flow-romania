
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div className={cn(
        'border-2 rounded-full animate-spin-slow', 
        sizeClasses[size],
        'border-returnbox-blue border-t-transparent'
      )} />
    </div>
  );
};

export default LoadingSpinner;
