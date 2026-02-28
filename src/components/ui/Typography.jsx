import React from 'react';

export const Heading = ({ 
  level = 1, 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-bold text-[rgb(var(--text-primary))]';
  
  const sizeClasses = {
    1: 'text-3xl sm:text-4xl lg:text-5xl',
    2: 'text-2xl sm:text-3xl lg:text-4xl',
    3: 'text-xl sm:text-2xl lg:text-3xl',
    4: 'text-lg sm:text-xl lg:text-2xl',
    5: 'text-base sm:text-lg lg:text-xl',
    6: 'text-sm sm:text-base lg:text-lg',
  };

  const Component = `h${level}`;

  return (
    <Component
      className={`${baseClasses} ${sizeClasses[level]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export const Text = ({ 
  size = 'base', 
  weight = 'normal', 
  color = 'primary',
  children, 
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorClasses = {
    primary: 'text-[rgb(var(--text-primary))]',
    secondary: 'text-[rgb(var(--text-secondary))]',
    accent: 'text-[rgb(var(--color-primary))]',
    success: 'text-[rgb(var(--color-success))]',
    warning: 'text-[rgb(var(--color-warning))]',
    danger: 'text-[rgb(var(--color-danger))]',
  };

  return (
    <p
      className={`
        ${sizeClasses[size] || sizeClasses.base}
        ${weightClasses[weight] || weightClasses.normal}
        ${colorClasses[color] || colorClasses.primary}
        ${className}
      `}
      {...props}
    >
      {children}
    </p>
  );
};