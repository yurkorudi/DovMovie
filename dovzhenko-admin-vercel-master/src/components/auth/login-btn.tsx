'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import LoginForm from '@/components/auth/login-form';
import { ROUTER_PATHS } from '@/routes';

interface LoginBtnProps {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
}

const LoginBtn: FC<LoginBtnProps> = ({
	children,
	mode = 'redirect',
	asChild = false,
}) => {
	const router = useRouter();
	const onClick = () => router.push(ROUTER_PATHS.LOGIN);

	if (mode === 'modal') {
		return (
			<Dialog>
				<DialogTrigger asChild={asChild}>{children}</DialogTrigger>
				<DialogContent className='w-auto border-none bg-transparent p-0'>
					<LoginForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<span className='cursor-pointer' onClick={onClick}>
			{children}
		</span>
	);
};

export default LoginBtn;
