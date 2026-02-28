import React from 'react';

export const FormRow = ({ children, cols = 1, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[cols] || gridCols[1]} gap-4 ${className}`}>
      {children}
    </div>
  );
};

export const FormSection = ({ title, description, children }) => {
  return (
    <div className="space-y-6">
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">{title}</h3>}
          {description && <p className="text-sm text-[rgb(var(--text-secondary))] mt-1">{description}</p>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};