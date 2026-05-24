import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700'
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
