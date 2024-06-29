import {create} from 'zustand';

type useDrawerProps = {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export const useDrawer = create<useDrawerProps>(set => ({
  isDrawerOpen: false,
  openDrawer: () => {
    set({isDrawerOpen: true});
  },
  closeDrawer: () => {
    set({isDrawerOpen: false});
  },
}));
