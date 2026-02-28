import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { NotificationProvider } from './NotificationContext';
import { ChatbotProvider } from './ChatbotContext';
import { ThemeProvider } from './ThemeContext';
import { SettingsProvider } from './SettingsContext';

export const AppProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <SettingsProvider>
            <NotificationProvider>
              <ChatbotProvider>
                {children}
              </ChatbotProvider>
            </NotificationProvider>
          </SettingsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};