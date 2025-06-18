'use client';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '@/providers/AppProvider';
import MobileNavList from '@/components/navigation/mobile/mobile-nav-list';
import clsx from 'clsx';
import { useMediaQuery } from 'react-responsive';

const MobileNavigation = () => {
	const { isOpen, setIsOpen } = useContext(AppContext);
	const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

	useEffect(() => {
		if (isOpen) document.body.classList.add('overflow-hidden');
		else document.body.classList.remove('overflow-hidden');
	}, [isOpen]);

	useEffect(() => {
		if (!isMobile) setIsOpen(false);
	}, [isMobile]);

	return (
		<div
			className={clsx(
				'fixed z-40 h-dvh max-h-dvh w-full bg-main transition-all duration-300',
				{
					'top-[70px]': isOpen,
					'top-[-120%]': !isOpen,
				},
			)}
		>
			<MobileNavList />
		</div>
	);
};

export default MobileNavigation;
