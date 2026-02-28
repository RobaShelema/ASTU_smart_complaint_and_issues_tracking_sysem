import React from 'react';

const ResponsiveTable = ({ 
  headers, 
  data, 
  renderRow,
  emptyMessage = 'No data available',
  loading = false 
}) => {
  return (
    <div className="table-container">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="table">
          <thead className="table-header">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="table-header-cell">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--color-primary))]"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-[rgb(var(--text-secondary))]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => renderRow(item, index))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--color-primary))]"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-[rgb(var(--text-secondary))]">
            {emptyMessage}
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="card">
              <div className="card-body">
                {headers.map((header, hIndex) => (
                  <div key={hIndex} className="flex items-center justify-between py-2 border-b border-[rgb(var(--border-color))] last:border-0">
                    <span className="text-sm font-medium text-[rgb(var(--text-secondary))]">
                      {header.label}:
                    </span>
                    <span className="text-sm text-[rgb(var(--text-primary))]">
                      {header.accessor ? item[header.accessor] : header.render?.(item)}
                    </span>
                  </div>
                ))}
                {header.actions && (
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-[rgb(var(--border-color))]">
                    {header.actions(item)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResponsiveTable;