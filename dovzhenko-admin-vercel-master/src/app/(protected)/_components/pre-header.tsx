'use client';
import React from 'react';
import { Montserrat as FontSans } from 'next/font/google';
import { cn, getPageTitle } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import BackButton from '@/components/back-button';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['300', '400'],
});

const PreHeader = () => {
	const pathname = usePathname();
	const pageTitle = getPageTitle(pathname);

	return (
		<div className={cn(fontSans.className, 'mb-10')}>
			<div className='flex items-center'>
				<BackButton />
				<h1 className='text-3xl font-bold tracking-wide text-link-hover dark:text-white'>
					{pageTitle}
				</h1>
			</div>
			<Separator className='mt-2 block' />
			{/*<BreadCrumbs />*/}
		</div>
	);
};

export default PreHeader;
