import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'swiper/css';
import Header from '@/components/base/Header';
import LanguageProvider from '@/providers/LanguageProvider';
import { ReactNode } from 'react';
import MobileNavigation from '@/components/navigation/mobile/mobile-navigation';
import AppWrapper from '@/components/AppWrapper';
import clsx from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Центр Довженка',
	description: 'Культурно-освітній центр ім. Олександра Довженка',
	keywords:
		'Орендувати зал, придбати квитки, квитки, оренда, довженка, дитячі студії, дитячі гуртки, події',
	openGraph: {
		siteName: 'Культурно-освітній центр ім. Олександра Довженка',
		url: 'https://www.dovzhenko-center.lviv.ua/',
		description: 'Культурно-освітній центр ім. Олександра Довженка',
		title: 'Центр Довженка',
		type: 'article',
		locale: 'uk_UK',
	},
	twitter: {
		card: 'summary',
		title: 'Центр Довженка',
		description: 'Культурно-освітній центр ім. Олександра Довженка',
	},
	icons: {
		icon: '/static/favicon.ico',
	},
};

const RootLayout = async ({
	children,
	params: { locale },
}: Readonly<{
	children: ReactNode;
	params: any;
}>) => {
	return (
		<html lang={locale} className='min-h-full'>
			<body className={clsx(inter.className, 'min-h-screen')}>
				<LanguageProvider lang={locale}>
					<AppWrapper>
						<Header locale={locale} />
						<MobileNavigation />
					</AppWrapper>
					{children}
				</LanguageProvider>
			</body>
		</html>
	);
};

export default RootLayout;
