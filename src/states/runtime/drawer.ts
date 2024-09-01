import { create } from "zustand";

type useDrawerState = {
  isDrawerOpen: boolean;
};

type useDrawerActions = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

export type useDrawerProps = useDrawerState & useDrawerActions;

export const useDrawer = create<useDrawerProps>((set) => ({
  isDrawerOpen: false,
  openDrawer: () =>
    set((state) => (state.isDrawerOpen ? state : { isDrawerOpen: true })),
  closeDrawer: () =>
    set((state) => (state.isDrawerOpen ? { isDrawerOpen: false } : state)),
}));
