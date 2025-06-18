'use client';
import { PropsWithChildren, useEffect } from 'react';
import { useAppStore } from '@/store/app';
import { useMediaQuery } from 'react-responsive';

const ProtectedWrapper = ({ children }: PropsWithChildren) => {
	const setSmallScreen = useAppStore((state) => state.setSmallScreen);
	const isSmallScreen = useMediaQuery({ query: '(max-width: 700px)' });

	useEffect(() => {
		if (isSmallScreen) {
			setSmallScreen(true);
		} else setSmallScreen(false);

		return () => {
			setSmallScreen(false);
		};
	}, [isSmallScreen]);

	return children;
};

export default ProtectedWrapper;
