import React from 'react';

const Grid = ({ 
  children, 
  cols = 1, 
  gap = 4,
  responsive = true,
  className = '' 
}) => {
  const getGridCols = () => {
    if (!responsive) {
      return `grid-cols-${cols}`;
    }

    const responsiveClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    };

    return responsiveClasses[cols] || responsiveClasses[1];
  };

  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  };

  return (
    <div className={`
      grid
      ${getGridCols()}
      ${gapClasses[gap] || 'gap-4'}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Grid;