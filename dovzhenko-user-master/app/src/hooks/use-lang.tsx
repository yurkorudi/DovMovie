import { useContext } from 'react';
import { LanguageContext } from '@/providers/LanguageProvider';

export const useLang = () => {
	const lang = useContext(LanguageContext);

	if (lang === null) {
		throw new Error('useLang hook must be used within LanguageProvider');
	}

	return lang;
};

export const t = (values: any[]) => {
	const lang = useLang();
	const isUK = lang === 'uk';

	return isUK ? values[0] : values[1];
};
