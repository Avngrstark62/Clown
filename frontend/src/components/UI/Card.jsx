/**
 * Reusable Card Component
 * Used for content containers throughout the app
 */

const Card = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-sm border border-emerald-100 overflow-hidden';
  const hoverStyles = hoverable ? 'hover:shadow-md transition-shadow duration-300' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
