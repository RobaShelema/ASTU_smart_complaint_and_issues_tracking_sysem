import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MobileMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-[rgb(var(--bg-secondary))] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-[rgb(var(--bg-primary))] shadow-xl z-50 
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--border-color))]">
          <span className="font-semibold">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-[rgb(var(--bg-secondary))] transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {children}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;