import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string; // <-- Nuevo: Recibe el mensaje de error
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`mt-1 block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 transition-colors
        ${
          error
            ? 'border-red-500 focus:ring-red-500' // Si hay error, se pone rojo
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500' // Si no, azul o normal
        } ${className}`}
        {...props}
      />
      {/* Mensaje de error de texto debajo del input */}
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
}
