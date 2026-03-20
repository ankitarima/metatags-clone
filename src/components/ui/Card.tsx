import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children }) => (
  <div className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-950 dark:text-gray-50 shadow-sm ${className}`}>
    {children}
  </div>
);
