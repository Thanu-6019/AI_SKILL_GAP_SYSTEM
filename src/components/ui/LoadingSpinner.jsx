const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-center">
        <div 
          className={`inline-block animate-spin rounded-full border-b-2 border-blue-500 mb-4 ${sizeClasses[size]}`}
        ></div>
        <p className="text-slate-400 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
