'use client';
import clsx from 'clsx';
import {
	LegacyRef,
	PropsWithChildren,
	useRef,
	MouseEvent,
	useContext,
} from 'react';
import localFont from 'next/font/local';
import dynamic from 'next/dynamic';
import { AppContext } from '@/providers/AppProvider';
import Link from 'next/link';
import { ENavLinks } from '@/constants/navigation';
import { useRouter } from 'next/navigation';

const GilroyRegular = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const NavItem = ({
	children,
	className,
	link,
	parentClassName,
	disableAnimation,
}: PropsWithChildren<{
	className: string;
	link: string;
	parentClassName?: string;
	disableAnimation?: boolean;
}>) => {
	const linkRef = useRef<HTMLAnchorElement>();
	const { setIsOpen } = useContext(AppContext);
	const router = useRouter();

	const handleScrollClick = (e: MouseEvent<HTMLSpanElement>, omit: boolean) => {
		setIsOpen && setIsOpen(false);
		if (omit) return;
		e.preventDefault();
		const target = linkRef?.current?.ownerDocument?.querySelector(link);

		const scroll = () => {
			const targetPosition =
				target!.getBoundingClientRect().top + window.pageYOffset;
			const offsetPosition = targetPosition - 70; // Adding 70 pixels to the position

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth',
			});
		};

		const redirectTo = () => {
			const targetName = link.replace('#', '');
			router.push('/?scrollTo=' + targetName);
		};

		target ? scroll() : redirectTo();
	};

	const getOmit = (link: string) => {
		const omitCooperation = link === ENavLinks.Cooperation;
		const omitMovies = link === ENavLinks.Movies;

		return omitMovies || omitCooperation;
	};

	return (
		<li className={clsx(GilroyRegular.className, parentClassName)}>
			<Link href={link}>
				<span
					ref={linkRef as LegacyRef<HTMLSpanElement>}
					className={clsx(className, 'cursor-pointer !text-[20px] md:!text-xs')}
					onClick={(e) => handleScrollClick(e, getOmit(link))}
				>
					{children}
					{!disableAnimation && (
						<span className='block h-[0.7px] max-w-0 bg-gold transition-all duration-300 group-hover:max-w-full'></span>
					)}
				</span>
			</Link>
		</li>
	);
};

export default dynamic(() => Promise.resolve(NavItem), { ssr: false });
