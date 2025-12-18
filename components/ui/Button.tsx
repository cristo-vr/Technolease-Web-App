import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-zinc-100 text-zinc-950 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-transparent",
    secondary: "bg-transparent text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white hover:bg-zinc-900",
    danger: "bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 hover:text-red-300",
    ghost: "bg-transparent text-zinc-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
};