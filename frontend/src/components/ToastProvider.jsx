/**
 * Toast Provider Component
 * Provides toast notifications throughout the app
 */

import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#111',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
        },
        success: {
          duration: 3000,
          style: {
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #dcfce7',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#f0fdf4',
          },
        },
        error: {
          duration: 3500,
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fee2e2',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fef2f2',
          },
        },
        loading: {
          style: {
            background: '#fffbeb',
            color: '#92400e',
            border: '1px solid #fef08a',
          },
          iconTheme: {
            primary: '#f59e0b',
            secondary: '#fffbeb',
          },
        },
      }}
    />
  );
};
