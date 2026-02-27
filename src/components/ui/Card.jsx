const Card = ({ 
  children, 
  title, 
  subtitle, 
  icon: Icon,
  className = '',
  hoverable = false 
}) => {
  return (
    <div
      className={`
        bg-slate-800 rounded-2xl p-6 shadow-lg
        transition-all duration-300
        ${
          hoverable
            ? 'hover:scale-[1.02] cursor-pointer'
            : ''
        }
        ${className}
      `}
    >
      {(title || subtitle || Icon) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-slate-100 mb-1">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl ring-1 ring-blue-500/30 hover:ring-blue-500/50 transition-all duration-300 hover:scale-110">
              <Icon className="w-6 h-6 text-blue-400" />
            </div>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
