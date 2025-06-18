'use client';

import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

const MainContent = ({
	children,
	className,
}: PropsWithChildren & { className?: string }) => {
	return (
		<div
			className={cn(
				className,
				'h-full w-full py-8 pl-[32px] pr-8 md:pl-[292px]',
			)}
		>
			<div className='mx-auto max-w-[1100px]'>{children}</div>
		</div>
	);
};

export default MainContent;
