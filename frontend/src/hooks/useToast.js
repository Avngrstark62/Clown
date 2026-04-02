/**
 * Custom hook for toast notifications
 * Wraps react-hot-toast with consistent styling and defaults
 */

import toast from 'react-hot-toast';
import { CONFIG } from '../constants';

const defaultOptions = {
  duration: CONFIG.TOAST_DURATION,
  position: 'top-right',
};

export const useToast = () => {
  return {
    success: (message, options = {}) =>
      toast.success(message, { ...defaultOptions, ...options }),
    
    error: (message, options = {}) =>
      toast.error(message, { ...defaultOptions, ...options }),
    
    loading: (message, options = {}) =>
      toast.loading(message, { ...defaultOptions, ...options }),
    
    info: (message, options = {}) =>
      toast(message, { ...defaultOptions, ...options }),
    
    // For custom promises (e.g., API calls)
    promise: (promise, messages, options = {}) =>
      toast.promise(promise, messages, { ...defaultOptions, ...options }),
    
    // Dismiss a specific toast or all toasts
    dismiss: (toastId) => {
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
    },
  };
};
