import { forwardRef } from 'react';

export const FormGroup = ({ label, error, required, children, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {label && (
      <label className="block text-xs font-bold uppercase tracking-wider text-[#082B36] font-display">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children}
    {error && <p className="text-xs text-red-500 font-medium mt-1">{error}</p>}
  </div>
);

export const Input = forwardRef(({
  type = 'text',
  label,
  error,
  required,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  const inputEl = (
    <div className="relative w-full">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      )}
      <input
        ref={ref}
        type={type}
        required={required}
        className={`
          w-full block bg-white border border-[#E2E8E5] rounded-xl text-sm text-[#082B36] placeholder-gray-400
          h-11 px-4 ${Icon ? 'pl-11' : ''}
          focus:outline-none focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/15 transition-all
          disabled:bg-gray-50 disabled:opacity-60
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
  );

  if (label || error) {
    return <FormGroup label={label} error={error} required={required}>{inputEl}</FormGroup>;
  }

  return inputEl;
});

Input.displayName = 'Input';

export const Select = forwardRef(({
  label,
  error,
  required,
  options = [],
  children,
  className = '',
  ...props
}, ref) => {
  const selectEl = (
    <select
      ref={ref}
      required={required}
      className={`
        w-full block bg-white border border-[#E2E8E5] rounded-xl text-sm text-[#082B36] font-medium
        h-11 px-4 focus:outline-none focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/15 transition-all
        disabled:bg-gray-50 disabled:opacity-60
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
        ${className}
      `}
      {...props}
    >
      {options.length > 0
        ? options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        : children}
    </select>
  );

  if (label || error) {
    return <FormGroup label={label} error={error} required={required}>{selectEl}</FormGroup>;
  }

  return selectEl;
});

Select.displayName = 'Select';

export const TextArea = forwardRef(({
  label,
  error,
  required,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  const areaEl = (
    <textarea
      ref={ref}
      rows={rows}
      required={required}
      className={`
        w-full block bg-white border border-[#E2E8E5] rounded-xl text-sm text-[#082B36] placeholder-gray-400
        p-4 focus:outline-none focus:border-[#00E676] focus:ring-4 focus:ring-[#00E676]/15 transition-all resize-none
        disabled:bg-gray-50 disabled:opacity-60
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
        ${className}
      `}
      {...props}
    />
  );

  if (label || error) {
    return <FormGroup label={label} error={error} required={required}>{areaEl}</FormGroup>;
  }

  return areaEl;
});

TextArea.displayName = 'TextArea';

