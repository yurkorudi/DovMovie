'use client';

import { useState, useEffect } from 'react';
import moment, { Moment } from 'moment';
import 'moment/locale/uk';
import { generateWeekDates } from '@/lib/movies';
import { nanoid } from 'nanoid';
import { useMediaQuery } from 'react-responsive';
import clsx from 'clsx';
import localFont from 'next/font/local';

const GilroyBold = localFont({
	src: '../../../public/fonts/Gilroy-Bold.woff',
});

const GilroyRegular = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const MovieListCalendar = ({
	locale,
	onDateChange,
}: {
	locale: string;
	onDateChange: (date: Moment) => void;
}) => {
	const [dates, setDates] = useState<Moment[]>([]);
	const isLg = useMediaQuery({ query: '(min-width: 920px)' });
	const [currentDate, setCurrentDate] = useState(moment());

	const handleDateChange = (date: Moment) => {
		setCurrentDate(date);
		onDateChange(date);
	};

	useEffect(() => {
		moment.updateLocale(locale, {});
		setDates(generateWeekDates());
	}, [locale]);

	useEffect(() => {
		setCurrentDate(moment());
	}, []);

	return (
		<div className='overflow-hidden rounded-sm bg-main p-4 text-white'>
			<div className={clsx('flex max-w-full gap-x-2 overflow-x-auto')}>
				{dates.map((date) => (
					<button
						key={nanoid()}
						onClick={() => handleDateChange(date)}
						className={clsx(
							'min-w-[130px] flex-grow rounded-md  border px-4 py-2',
							{
								'border-gold-hover bg-gold-hover hover:border-transparent':
									moment(currentDate).isSame(date, 'day'),
								'border-white/50 hover:border-white': !moment(
									currentDate,
								).isSame(date, 'day'),
							},
						)}
					>
						<div className='flex flex-col items-center'>
							<p className={clsx(GilroyBold.className, 'text-md font-bold')}>
								{date.format(isLg ? 'D MMMM' : 'D MMM')}
							</p>
							<p className={clsx(GilroyRegular.className)}>
								{date.format(isLg ? 'dddd' : 'ddd')}
							</p>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default MovieListCalendar;
