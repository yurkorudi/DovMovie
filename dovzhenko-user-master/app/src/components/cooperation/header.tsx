import React from 'react';
import LargeContainer from '@/components/containers/large-container';
import { Forum } from 'next/font/google';
import clsx from 'clsx';
import TranslationsProvider from '@/providers/TranslatorProvider';
import initTranslations from '@/app/i18n';

const ForumSans = Forum({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const nameSpaces = ['common'];

const Header = async ({ locale }: { locale: string }) => {
	const { t, resources } = await initTranslations(locale, nameSpaces);

	return (
		<TranslationsProvider
			namespaces={nameSpaces}
			resources={resources}
			locale={locale}
		>
			<div
				style={{
					backgroundImage:
						'linear-gradient(180deg,rgba(28,12,79,.1) 0,rgba(28,12,81,.4) 33.65%,rgba(37,20,71,.8) 100%),url("/static/images/cooperation/header.webp")',
				}}
				className={clsx(
					'bg-cover bg-no-repeat pt-16 text-6xl uppercase leading-[66px] text-gold',
					ForumSans.className,
				)}
			>
				<LargeContainer>
					<div className='mx-auto max-w-[1110px]'>
						<h1>{t('cooperation-title')}</h1>
					</div>
				</LargeContainer>
			</div>
		</TranslationsProvider>
	);
};

export default Header;
