const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'font-medium rounded-xl transition-all duration-300 flex items-center justify-center space-x-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white hover:scale-105 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
    secondary: 'bg-slate-700/80 hover:bg-slate-600 text-white backdrop-blur-sm border border-slate-600 hover:border-slate-500',
    ghost: 'bg-transparent hover:bg-slate-700/50 text-slate-300 hover:text-white border border-transparent hover:border-slate-600',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white hover:scale-105 shadow-lg shadow-red-500/30',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
