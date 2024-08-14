import { create } from "zustand";

type useDrawerProps = {
	isDrawerOpen: boolean;
	openDrawer: () => void;
	closeDrawer: () => void;
};

export const useDrawer = create<useDrawerProps>((set, get) => ({
	isDrawerOpen: false,
	openDrawer: () => {
		if (get().isDrawerOpen) return;
		set({ isDrawerOpen: true });
	},
	closeDrawer: () => {
		if (!get().isDrawerOpen) return;
		set({ isDrawerOpen: false });
	},
}));
