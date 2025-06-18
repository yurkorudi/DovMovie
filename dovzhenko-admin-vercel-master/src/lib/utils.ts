import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TITLE_ROUTES } from '@/routes';
import moment from 'moment-timezone';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getPageTitle = (pathname: string) => {
	return (
		TITLE_ROUTES.find((route) => route.path === pathname)?.name || 'Page Title'
	);
};

export const getOrigin = () => process.env.APP_ORIGIN;

export const valueToSelectOption = (value: string) => ({ value, label: value });

export const getGTEStartTime = () => {
	const kyivTimeZone = 'Europe/Kiev';
	const currentUtcTime = moment.utc();
	const kyivCurrentTime = currentUtcTime.tz(kyivTimeZone);

	// Resetting time to the start of the day in Kyiv timezone
	const startOfDay = kyivCurrentTime.clone().startOf('day');

	return startOfDay.utc().toDate();
};
