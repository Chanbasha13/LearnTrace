import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  as: Component = 'div',
  ...props
}) {
  const hoverStyles = hover
    ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer'
    : '';

  return (
    <Component
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
