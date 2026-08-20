import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'p-2 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2';

  const variantClasses = {
    // Azul claro y translúcido en modo oscuro cuando está deshabilitado
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-400 dark:disabled:bg-blue-500/40 disabled:cursor-not-allowed',
    danger:
      'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 disabled:bg-red-400 dark:disabled:bg-red-500/40 disabled:cursor-not-allowed',
    secondary:
      'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
