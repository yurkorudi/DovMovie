'use client';
import { PropsWithChildren } from 'react';
import { logout } from '@/actions/auth';
import { cn } from '@/lib/utils';

const LogoutBtn = ({
	children,
	className,
}: PropsWithChildren & { className?: string }) => {
	const onClick = () => logout();

	return (
		<span
			className={cn('inline-block cursor-pointer', className)}
			onClick={onClick}
		>
			{children}
		</span>
	);
};

export default LogoutBtn;
