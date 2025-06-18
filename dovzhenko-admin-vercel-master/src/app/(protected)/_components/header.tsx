'use client';
import React from 'react';
import Burger from '@/components/navbar/Burger';
import { useAppStore } from '@/store/app';
import { cn } from '@/lib/utils';

const Header = () => {
	const { isSidebarOpen, isSmallScreen } = useAppStore((state) => state);

	return (
		<header
			className={cn('h-[60px]', {
				hidden: !isSmallScreen,
			})}
		>
			<div
				className={cn(
					'flex h-full translate-y-[-100%] items-center justify-end bg-main px-8 transition-all duration-300',
					{
						'fixed translate-y-[-100%]': isSidebarOpen && !isSmallScreen,
						'translate-y-0': !isSidebarOpen && isSmallScreen,
					},
				)}
			>
				<Burger className='mr-[-4px]' />
			</div>
		</header>
	);
};

export default Header;
