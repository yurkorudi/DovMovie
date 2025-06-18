'use client';
import { useAppStore } from '@/store/app';
import { cn } from '@/lib/utils';

const BlurredScreen = () => {
	const { isSidebarOpen, toggleSidebar, isSmallScreen } = useAppStore(
		(state) => state,
	);

	return (
		<div
			className={cn({
				'fixed bottom-0 left-0 right-0 top-0 z-10 backdrop-blur-sm transition-all duration-300':
					isSidebarOpen,
				'z-0 hidden': !isSidebarOpen || !isSmallScreen,
			})}
			onClick={toggleSidebar}
		></div>
	);
};

export default BlurredScreen;
