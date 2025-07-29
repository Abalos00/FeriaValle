import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const classes = [
    'bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg',
    paddingClasses[padding],
    className
  ].join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};