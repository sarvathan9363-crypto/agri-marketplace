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
  const baseStyles = 'inline-flex items-center justify-center font-display font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-none';

  const variants = {
    primary: 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-contrast)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] border border-transparent',
    secondary: 'bg-[var(--surface-elevated)] hover:bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-[var(--shadow-sm)]',
    outline: 'bg-transparent hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--primary)]',
    ghost: 'bg-transparent hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-transparent',
    danger: 'bg-[var(--danger)] hover:brightness-95 text-white shadow-[var(--shadow-sm)] border border-transparent',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 rounded-[var(--radius-sm)] gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-[var(--radius-md)] gap-2',
    lg: 'text-base px-7 py-3.5 rounded-[var(--radius-md)] gap-2.5',
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
