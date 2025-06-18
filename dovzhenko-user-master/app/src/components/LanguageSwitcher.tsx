'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import i18nConfig from 'app/i18nConfig';
import localFont from 'next/font/local';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

const GilroyRegular = localFont({
	src: '../../public/fonts/Gilroy-Regular.woff',
});

const LanguageSwitcher = ({
	parentClassName,
	className,
}: {
	parentClassName: string;
	className: string;
}) => {
	const { i18n } = useTranslation();
	const currentLocale = i18n.language;
	const router = useRouter();
	const currentPathname = usePathname();

	const handleChange = (newLocale: string) => {
		// set cookie for next-i18n-router
		const days = 30;
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		const expires = date.toUTCString();
		document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

		// redirect to the new locale path
		if (
			currentLocale === i18nConfig.defaultLocale &&
			!(i18nConfig as any).prefixDefault
		) {
			router.push('/' + newLocale + currentPathname);
		} else {
			router.push(
				currentPathname.replace(`/${currentLocale}`, `/${newLocale}`),
			);
		}

		router.refresh();
	};

	return currentLocale === 'uk' ? (
		<li className={clsx(GilroyRegular.className, parentClassName)}>
			<span
				className={clsx(className, '!text-[20px] md:!text-xs')}
				onClick={() => handleChange('en')}
			>
				EN
			</span>
		</li>
	) : (
		<li className={clsx(GilroyRegular.className, parentClassName)}>
			<span
				className={clsx(className, '!text-[20px] md:!text-xs')}
				onClick={() => handleChange('uk')}
			>
				UA
			</span>
		</li>
	);
};

export default dynamic(() => Promise.resolve(LanguageSwitcher), { ssr: false });
