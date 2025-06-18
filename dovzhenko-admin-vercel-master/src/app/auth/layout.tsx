import { PropsWithChildren } from 'react';
import LoginBackground from '@/components/auth/login-background';

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<div className='mx-auto grid h-full max-h-full items-center p-3'>
			<LoginBackground />
			<div className='relative z-10 flex overflow-x-hidden'>{children}</div>
		</div>
	);
};

export default Layout;
