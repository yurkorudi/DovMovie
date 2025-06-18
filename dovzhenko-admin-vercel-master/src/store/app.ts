import { create } from 'zustand';

type TAppStore = {
	isSidebarOpen: boolean;
	isLoading: boolean;
	isSmallScreen: boolean;
	setLoading: (loading: boolean) => void;
	setSmallScreen: (screenIsSmall: boolean) => void;
	toggleSidebar: () => void;
};

export const useAppStore = create<TAppStore>((set) => ({
	isSidebarOpen: false,
	isLoading: false,
	isSmallScreen: false,
	toggleSidebar: () =>
		set((state) => ({ ...state, isSidebarOpen: !state.isSidebarOpen })),
	setLoading: (loading) => set((state) => ({ ...state, isLoading: loading })),
	setSmallScreen: (isSmallScreen) =>
		set((state) => ({ ...state, isSmallScreen: isSmallScreen })),
}));
