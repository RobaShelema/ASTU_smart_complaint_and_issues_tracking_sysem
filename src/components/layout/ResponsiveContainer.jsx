import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ResponsiveContainer = ({ 
  children, 
  maxWidth = '7xl', 
  padding = true,
  className = '' 
}) => {
  const maxWidthClasses = {
    'sm': 'max-w-screen-sm',
    'md': 'max-w-screen-md',
    'lg': 'max-w-screen-lg',
    'xl': 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full',
    'none': ''
  };

  return (
    <div className={`
      mx-auto w-full
      ${maxWidthClasses[maxWidth] || 'max-w-7xl'}
      ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;