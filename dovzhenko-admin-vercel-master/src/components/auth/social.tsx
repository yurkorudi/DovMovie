'use client';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';
import { EProviders } from '@/lib/enums';
import { DEFAULT_REDIRECT } from '@/routes';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const Social = () => {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');

	const onClick = async (provider: EProviders) => {
		await signIn(provider, { callbackUrl: callbackUrl || DEFAULT_REDIRECT });
	};

	return (
		<div className='flex w-full items-center gap-x-2'>
			<Button
				size='lg'
				className='w-full py-2'
				variant='outline'
				onClick={() => onClick(EProviders.GOOGLE)}
			>
				<FcGoogle size={30} />
			</Button>
			<Button
				size='lg'
				className='w-full py-2'
				variant='outline'
				onClick={() => onClick(EProviders.GITHUB)}
			>
				<FaGithub size={30} />
			</Button>
		</div>
	);
};

export default Social;
