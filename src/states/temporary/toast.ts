import {create} from 'zustand';

export type ToastType = 'error' | 'success' | 'warning' | undefined;

export interface ToastProps {
  type: ToastType;
  message: string;
  action?: {label: string; onPress: () => void};
}

type useToastProps = {
  activeToast: ToastProps | null;
  openToast: (
    message: string,
    type?: ToastType,
    action?: {label: string; onPress: () => void},
  ) => void;
  closeToast: () => void;
};

export const useToast = create<useToastProps>(set => ({
  activeToast: null,
  openToast: (message, type, action) => {
    set(() => ({
      activeToast: {
        message,
        type,
        action,
      },
    }));
  },
  closeToast: () => set({activeToast: null}),
}));
