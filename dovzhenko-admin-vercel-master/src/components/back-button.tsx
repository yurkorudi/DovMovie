'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const BackButton = ({ className }: { className?: string }) => {
	const router = useRouter();
	const pathname = usePathname();

	const show = pathname.split('/').length > 2 && pathname !== '/';

	return (
		<div
			onClick={() => router.back()}
			className={cn(
				'mr-3 grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-full hover:bg-link-hover [&>svg]:hover:text-white',
				{ hidden: !show },
			)}
		>
			<ArrowLeft className={cn(className)} />
		</div>
	);
};

export default BackButton;
