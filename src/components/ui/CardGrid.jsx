import React from 'react';

const CardGrid = ({ 
  items, 
  renderCard, 
  columns = {
    default: 1,
    sm: 2,
    md: 3,
    lg: 4
  },
  gap = 4,
  loading = false,
  loadingSkeleton = 6
}) => {
  const getGridClass = () => {
    const classes = [];
    
    if (columns.default) classes.push(`grid-cols-${columns.default}`);
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    
    return classes.join(' ');
  };

  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  const SkeletonCard = () => (
    <div className="card animate-pulse">
      <div className="card-body">
        <div className="skeleton-circle h-12 w-12 mb-4"></div>
        <div className="skeleton-text h-4 w-3/4 mb-2"></div>
        <div className="skeleton-text h-4 w-1/2 mb-4"></div>
        <div className="skeleton-text h-20 w-full"></div>
      </div>
    </div>
  );

  return (
    <div className={`grid ${getGridClass()} ${gapClasses[gap] || 'gap-4'}`}>
      {loading ? (
        Array.from({ length: loadingSkeleton }).map((_, index) => (
          <SkeletonCard key={index} />
        ))
      ) : items.length === 0 ? (
        <div className="col-span-full text-center py-12 text-[rgb(var(--text-secondary))]">
          No items to display
        </div>
      ) : (
        items.map((item, index) => renderCard(item, index))
      )}
    </div>
  );
};

export default CardGrid;