import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * Button variants
 * @type {Object.<string, string>}
 */
const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  link: 'bg-transparent hover:underline text-blue-600 p-0 h-auto'
};

/**
 * Button sizes
 * @type {Object.<string, string>}
 */
const sizes = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-4 text-sm',
  lg: 'py-2 px-6 text-base'
};

/**
 * Button component
 */
const Button = forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  children,
  ...props
}, ref) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;