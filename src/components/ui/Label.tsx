import React from 'react';

interface LabelProps {
  className?: string;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ className = '', children }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);
