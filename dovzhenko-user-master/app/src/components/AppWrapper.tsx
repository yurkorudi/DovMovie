'use client';
import React, { useState } from 'react';
import AppProvider from '@/providers/AppProvider';

const AppWrapper = ({ children }: any) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<AppProvider isOpen={isOpen} setIsOpen={setIsOpen}>
			{children}
		</AppProvider>
	);
};

export default AppWrapper;
