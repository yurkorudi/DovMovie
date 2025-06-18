'use client';
import { PropsWithChildren, useEffect } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

const AppProvider = ({ children }: PropsWithChildren) => {
	const { systemTheme, setTheme } = useTheme();

	useEffect(() => {
		if (systemTheme === 'dark') {
			setTheme('dark');
		} else {
			setTheme('light');
		}
	}, [systemTheme]);

	return children;
};

export default dynamic(() => Promise.resolve(AppProvider), {});
