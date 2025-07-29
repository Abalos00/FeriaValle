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
    'block px-3 py-2.5 border border-gray-300 rounded-lg text-sm',
    'focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200',
    'disabled:bg-gray-50 disabled:cursor-not-allowed',
    error ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : '',
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