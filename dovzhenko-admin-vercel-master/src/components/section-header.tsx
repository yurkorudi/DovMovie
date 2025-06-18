import React from 'react';
import { cn } from '@/lib/utils';

const SectionHeader = ({
	title,
	className,
}: {
	title: string;
	className: string;
}) => {
	return (
		<div className={cn('pt-2', className)}>
			<h2 className='text-2xl text-slate-400'>{title}</h2>
		</div>
	);
};

export default SectionHeader;
