import { createContext, useContext, ReactNode } from 'react';
import { Toaster, toast } from 'sonner';

type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

interface ToastContextProps {
  showToast: (message: string, severity?: ToastSeverity) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = (msg: string, sev: ToastSeverity = 'info') => {
    switch (sev) {
      case 'success':
        toast.success(msg);
        break;
      case 'error':
        toast.error(msg);
        break;
      case 'warning':
        toast.warning(msg);
        break;
      default:
        toast.info(msg);
        break;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster position="bottom-left" richColors closeButton />
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
