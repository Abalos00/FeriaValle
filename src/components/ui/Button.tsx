import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed tracking-tight';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 text-white shadow-button hover:shadow-[0_18px_40px_rgba(59,130,246,0.45)] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary-300',
    secondary: 'bg-white/10 text-white border border-white/30 backdrop-blur hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60',
    danger: 'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-button hover:brightness-110 focus-visible:ring-2 focus-visible:ring-danger-300',
    success: 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-button hover:brightness-110 focus-visible:ring-2 focus-visible:ring-success-200',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-200',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  ].join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};
