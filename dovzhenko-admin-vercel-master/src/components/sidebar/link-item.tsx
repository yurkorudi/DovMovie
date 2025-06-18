import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Kanit } from 'next/font/google';

type TProps = {
	link: string;
	className?: string;
	children: React.ReactNode;
	icon?: React.ReactNode;
};

const fontSans = Kanit({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const LinkItem = ({ link, className, children, icon }: TProps) => {
	const pathname = usePathname();
	const activeLink = pathname === link;

	return (
		<div className='px-2'>
			<Link
				href={link}
				className={cn(
					'mb-2 flex w-full items-center gap-x-2 rounded-sm px-4 py-1 hover:bg-link [&>span]:hover:text-link-hover',
					className,
					{
						'bg-link': activeLink,
					},
				)}
			>
				{icon && (
					<span
						className={cn('text-sm text-svg dark:text-white', {
							'text-link-hover': activeLink,
						})}
					>
						{icon}
					</span>
				)}
				<span
					className={cn(
						fontSans.className,
						'text-md class-text w-full text-link-color dark:text-white',
						{
							'text-link-hover': activeLink,
						},
					)}
				>
					{children}
				</span>
			</Link>
		</div>
	);
};

export default LinkItem;
