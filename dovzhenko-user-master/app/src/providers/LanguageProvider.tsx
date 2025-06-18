'use client';
import { createContext, PropsWithChildren } from 'react';

export const LanguageContext = createContext<string | null>(null);

const LanguageProvider = ({
	children,
	lang,
}: PropsWithChildren<{ lang: string }>) => {
	return (
		<LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>
	);
};

export default LanguageProvider;
