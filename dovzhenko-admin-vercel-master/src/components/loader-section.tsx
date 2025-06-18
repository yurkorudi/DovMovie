import React, { PropsWithChildren } from 'react';
import Loader from '@/components/loader/loader';
import { cn } from '@/lib/utils';

const SectionLoader = ({
	isLoading,
	children,
	className,
}: PropsWithChildren & { isLoading: boolean; className: string }) => {
	return (
		<div className='h-100% flex items-center justify-center'>
			<div className={cn(className, '')}>
				{isLoading ? <Loader /> : children}
			</div>
		</div>
	);
};

export default SectionLoader;
