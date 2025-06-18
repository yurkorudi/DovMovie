'use client';

import { I18nextProvider } from 'react-i18next';
import initTranslations from '@/app/i18n';
import { createInstance } from 'i18next';
import { PropsWithChildren } from 'react';

const TranslationsProvider = ({
	children,
	locale,
	namespaces,
	resources,
}: PropsWithChildren<{
	namespaces: string[];
	resources: Record<string, any>;
	locale: string;
}>) => {
	const i18n = createInstance();

	initTranslations(locale, namespaces, i18n, resources);

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;
