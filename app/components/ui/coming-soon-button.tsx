import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComingSoonButtonProps {
  comingSoon?: boolean;
  orderLink?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ComingSoonButton({ 
  comingSoon = false, 
  orderLink, 
  children, 
  className,
  onClick 
}: ComingSoonButtonProps) {
  if (comingSoon) {
    return (
      <button
        disabled
        className={cn(
          "w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-75",
          className
        )}
        style={{
          backgroundColor: className?.includes('bg-[') ? 'rgba(107, 114, 128, 0.1)' : undefined,
          borderColor: className?.includes('border-[') ? 'rgba(107, 114, 128, 0.3)' : undefined,
        }}
      >
        <Clock className="w-4 h-4" />
        Coming Soon
      </button>
    );
  }

  if (orderLink) {
    return (
      <a
        href={orderLink}
        className={cn(
          "orbitron-font w-full sm:w-auto button-primary text-button-primary px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2 border border-transparent hover:bg-[var(--hover-gradient)] hover:text-[var(--icon-text-primary)] hover:border-[var(--border-secondary)] no-underline",
          className
        )}
        onClick={onClick}
      >
        {children}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    );
  }

  return (
    <button
      className={cn(
        "orbitron-font w-full sm:w-auto button-primary text-button-primary px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2 border border-transparent hover:bg-[var(--hover-gradient)] hover:text-[var(--icon-text-primary)] hover:border-[var(--border-secondary)]",
        className
      )}
      onClick={onClick}
    >
      {children}
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
