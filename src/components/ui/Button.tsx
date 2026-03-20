import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'icon';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ className = '', variant = 'default', size = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm',
    outline: 'border border-gray-200 dark:border-gray-800 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50 text-gray-600 dark:text-gray-400',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700',
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    icon: 'h-10 w-10',
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
