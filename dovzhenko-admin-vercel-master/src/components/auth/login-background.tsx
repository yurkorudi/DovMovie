'use client';
import React from 'react';
import Image from 'next/image';
import SignInBg from '@/components/svg/SignInScreenBackground/signin-bg.svg';
import dynamic from 'next/dynamic';

const LoginBackground = () => {
	return (
		<div className='fixed inset-0 z-0 dark:bg-secondary'>
			<Image
				src={SignInBg}
				alt='signin image'
				className='pointer-events-none absolute inset-0 h-full w-full object-cover object-center'
			/>
		</div>
	);
};

export default dynamic(() => Promise.resolve(LoginBackground), { ssr: false });
