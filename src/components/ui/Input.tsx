import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'block px-4 py-3 rounded-2xl text-sm text-gray-900 bg-white/90 border border-white/60 shadow-inner',
    'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200',
    'placeholder:text-gray-400',
    'disabled:bg-white/60 disabled:cursor-not-allowed',
    error ? 'border-danger-400 focus:ring-danger-400 focus:border-danger-400' : '',
    fullWidth ? 'w-full' : '',
    className
  ].join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
};
