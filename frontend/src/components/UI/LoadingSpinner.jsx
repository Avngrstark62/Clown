/**
 * Loading Spinner Component
 * Shows a spinning indicator while content is loading
 */

const LoadingSpinner = ({ size = 'md', label = 'Loading...' }) => {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeStyles[size]} border-emerald-300 border-t-emerald-600 rounded-full animate-spin`} />
      {label && <p className="text-gray-600 text-sm">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
