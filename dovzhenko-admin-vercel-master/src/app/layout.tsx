import '@/styles/globals.css';
import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/theme-provider';
import AppProvider from '@/providers/app-provider';
import { Metadata } from 'next';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	title: 'Адмін Панель',
	icons: {
		icon: '/static/favicon.ico',
	},
};

const RootLayout = ({ children }: PropsWithChildren) => {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={cn(
					'min-h-screen bg-background font-sans antialiased',
					fontSans.variable,
				)}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<AppProvider>
						{children}
						<Sonner />
						<Toaster />
					</AppProvider>
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
