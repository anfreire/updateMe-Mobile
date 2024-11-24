import { create } from "zustand";

export type ToastType = "error" | "success" | "warning";

export interface ToastProps {
  message: string;
  type?: ToastType;
  action?: { label: string; onPress: () => void };
}

type useToastState = {
  activeToast: ToastProps | null;
};

type useToastActions = {
  openToast: (
    message: ToastProps["message"],
    options?: Omit<ToastProps, "message">
  ) => void;
  closeToast: () => void;
};

export type useToastProps = useToastState & useToastActions;

export const useToast = create<useToastProps>((set) => ({
  activeToast: null,
  openToast: (message, options) =>
    set({
      activeToast: { message, type: options?.type, action: options?.action },
    }),
  closeToast: () =>
    set((state) => (state.activeToast ? { activeToast: null } : state)),
}));
