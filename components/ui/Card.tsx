import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div className={`bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-xl p-6 ${hoverEffect ? 'hover:border-zinc-600 transition-colors duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
};