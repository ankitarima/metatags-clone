import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-2 text-sm ring-offset-white dark:ring-offset-gray-950 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);
