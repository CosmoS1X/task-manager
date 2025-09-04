import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
};

type FlashFunction = (message: string, options?: ToastOptions) => void;

export const showInfo: FlashFunction = (message, options) => {
  toast.info(message, { ...defaultOptions, ...options });
};

export const showSuccess: FlashFunction = (message, options) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const showWarn: FlashFunction = (message, options) => {
  toast.warn(message, { ...defaultOptions, ...options });
};

export const showError: FlashFunction = (message, options) => {
  toast.error(message, { ...defaultOptions, ...options });
};
