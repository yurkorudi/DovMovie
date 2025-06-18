'use client';

import React from 'react';
import LinkItem from '@/components/sidebar/link-item';
import FooterDropdown from '@/components/sidebar/FooterDropdown';
import { DEFAULT_REDIRECT } from '@/routes';
import { useAppStore } from '@/store/app';
import { cn } from '@/lib/utils';
import { sidebarNavigation } from '@/constants/sidebar';
import { nanoid } from 'nanoid';
import Image from 'next/image';

const Sidebar = () => {
	const { isSidebarOpen, isSmallScreen } = useAppStore((state) => state);

	return (
		<div
			className={cn(
				'fixed left-0 top-0 z-[49] w-64 min-w-64 border-r bg-main transition-all duration-300',
				{
					'translate-x-[-100%]': !isSidebarOpen && isSmallScreen,
					'translate-x-0': isSidebarOpen && isSmallScreen,
				},
			)}
		>
			<div className='flex h-dvh max-h-dvh flex-col justify-between'>
				<div>
					<div className='mx-6 mt-8'>
						<a href={DEFAULT_REDIRECT}>
							<Image src='/logo.png' alt='logo' width={98} height={36} />
						</a>
					</div>
					<div className='mt-12'>
						<ul>
							{sidebarNavigation.map((route) => {
								return route?.path ? (
									<li className='w-full' key={nanoid()}>
										<LinkItem link={route.path} icon={route.icon}>
											{route.name}
										</LinkItem>
									</li>
								) : (
									<span key={nanoid()}>{route.icon}</span>
								);
							})}
						</ul>
					</div>
				</div>
				{/*Footer Dropdown*/}
				<div className='relative mb-6'>
					<FooterDropdown />
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
