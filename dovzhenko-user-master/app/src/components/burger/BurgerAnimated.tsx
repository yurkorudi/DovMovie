'use client';
import { useContext } from 'react';
import clsx from 'clsx';
import { AppContext } from '@/providers/AppProvider';

const BurgerAnimated = () => {
	const { isOpen, setIsOpen } = useContext(AppContext);
	const genericHamburgerLine =
		'h-[2px] w-6 my-1 rounded-full bg-white transition ease transform duration-300 md:hidden';

	return (
		<button
			className='group flex h-12 w-12 flex-col items-end justify-center'
			onClick={() => setIsOpen(!isOpen)}
			aria-label='burger menu'
		>
			<div
				className={clsx(genericHamburgerLine, {
					'translate-y-2.5 rotate-45': isOpen,
				})}
			/>
			<div
				className={clsx(genericHamburgerLine, {
					'opacity-0': isOpen,
					'opacity-100': !isOpen,
				})}
			/>
			<div
				className={clsx(genericHamburgerLine, {
					'-translate-y-2.5 -rotate-45': isOpen,
				})}
			/>
		</button>
	);
};

export default BurgerAnimated;
