import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from './Icon';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
const listeners: Array<(toasts: ToastMessage[]) => void> = [];
let toasts: ToastMessage[] = [];

const emitChange = () => {
  for (const listener of listeners) {
    listener(toasts);
  }
};

const removeToast = (id: number) => {
    toasts = toasts.filter(t => t.id !== id);
    emitChange();
}

export const toast = {
  success: (message: string) => {
    const id = toastId++;
    toasts = [...toasts, { id, message, type: 'success' }];
    emitChange();
    setTimeout(() => removeToast(id), 5000);
  },
  error: (message: string) => {
    const id = toastId++;
    toasts = [...toasts, { id, message, type: 'error' }];
    emitChange();
    setTimeout(() => removeToast(id), 5000);
  },
  info: (message: string) => {
    const id = toastId++;
    toasts = [...toasts, { id, message, type: 'info' }];
    emitChange();
    setTimeout(() => removeToast(id), 5000);
  },
};

const Toast: React.FC<{ message: ToastMessage; onDismiss: (id: number) => void }> = ({ message, onDismiss }) => {
    const typeClasses = {
        success: 'from-green-500/50 to-green-600/50 text-green-100 border-green-500/80',
        error: 'from-red-500/50 to-red-600/50 text-red-100 border-red-500/80',
        info: 'from-blue-500/50 to-blue-600/50 text-blue-100 border-blue-500/80',
    };

    const iconName : {[key: string]: 'success' | 'error' | 'info'} = {
        success: 'success',
        error: 'error',
        info: 'info',
    };

    return (
        <div 
            className={`flex items-center gap-4 w-full max-w-sm p-4 rounded-lg shadow-lg bg-gradient-to-br border backdrop-blur-md transition-all duration-300 animate-toast-in ${typeClasses[message.type]}`}
            role="alert"
        >
            <Icon name={iconName[message.type]} className="w-6 h-6 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{message.message}</p>
            <button onClick={() => onDismiss(message.id)} className="p-1 rounded-full hover:bg-white/10 flex-shrink-0">
                <Icon name="close" className="w-5 h-5" />
            </button>
        </div>
    );
};

export const Toaster: React.FC = () => {
  const [currentToasts, setCurrentToasts] = useState(toasts);

  const handleDismiss = useCallback((id: number) => {
    removeToast(id);
  }, []);

  useEffect(() => {
    const listener = (newToasts: ToastMessage[]) => setCurrentToasts(newToasts);
    listeners.push(listener);
    setCurrentToasts(toasts); // Sync on mount
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 w-full max-w-sm">
      {currentToasts.map(t => (
        <Toast key={t.id} message={t} onDismiss={handleDismiss} />
      ))}
    </div>
  );
};
