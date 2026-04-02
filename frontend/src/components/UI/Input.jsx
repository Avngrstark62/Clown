/**
 * Reusable Input Component
 * Supports text, email, password, and other input types
 */

const Input = ({
  label,
  type = 'text',
  placeholder = '',
  error = null,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseStyles} ${errorStyles} ${disabledStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
