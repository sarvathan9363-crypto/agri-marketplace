import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  type = 'button',
  variant = 'primary', // primary | secondary | outline | ghost | danger
  size = 'md', // sm | md | lg
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-display font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-[#00ed64] hover:bg-[#00d659] text-[#001e2b] shadow-md hover:shadow-lg hover:shadow-[#00ed64]/20 border border-transparent',
    secondary: 'bg-[#001e2b] hover:bg-[#001722] text-white border border-emerald-900/40 shadow-sm',
    outline: 'bg-transparent hover:bg-[#001e2b] text-[#001e2b] hover:text-white border-2 border-[#001e2b]',
    ghost: 'bg-transparent hover:bg-[#00684a]/10 text-[#001e2b] border border-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm border border-transparent',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 rounded-xl gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-2xl gap-2',
    lg: 'text-base px-7 py-3.5 rounded-full gap-2.5',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
      ) : null}
      <span>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
