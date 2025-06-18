'use client';
import { useAppStore } from '@/store/app';
import { cn } from '@/lib/utils';

const Burger = ({ className }: { className?: string }) => {
	const toggleSidebar = useAppStore((state) => state.toggleSidebar);

	return (
		<div
			className={cn(className, 'me-4 flex cursor-pointer flex-col rounded p-2')}
			onClick={toggleSidebar}
		>
			<span className='mb-1 h-[2px] w-[20px] bg-svg'></span>
			<span className='mb-1 h-[2px] w-[20px] bg-svg'></span>
			<span className='h-[2px] w-[20px] bg-svg'></span>
		</div>
	);
};

export default Burger;
