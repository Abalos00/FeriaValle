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
    'bg-gradient-to-br from-white/95 to-white/75 backdrop-blur-2xl border border-white/60 rounded-[28px] shadow-[0_35px_70px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_45px_90px_rgba(15,23,42,0.15)]',
    paddingClasses[padding],
    className
  ].join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
