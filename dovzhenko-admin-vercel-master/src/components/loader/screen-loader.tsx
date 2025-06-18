'use client';
import React from 'react';
import Loader from '@/components/loader/loader';
import { useAppStore } from '@/store/app';
import { cn } from '@/lib/utils';

const ScreenLoader = ({ show = false }: { show?: boolean }) => {
	const isLoading = useAppStore((state) => state.isLoading);

	return (
		<div
			className={cn('hidden', {
				'fixed bottom-0 left-0 right-0 top-0 z-[100] m-0 flex items-center  justify-center backdrop-blur-sm':
					show || isLoading,
			})}
		>
			<Loader />
		</div>
	);
};

export default ScreenLoader;
