import clsx from 'clsx';
import React from 'react';
import localFont from 'next/font/local';
import { t } from '@/hooks/use-lang';
import { Mdiv } from '@/components/motion';
import { bottomAnimation } from '@/constants/animations';

const GilroyThin = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const GilroyReg = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const StudiosSchedule = ({
	scheduleDays,
	scheduleDaysEng,
	scheduleTime,
	scheduleTimeEng,
}: {
	scheduleDays: string;
	scheduleDaysEng: string;
	scheduleTime: string;
	scheduleTimeEng: string;
}) => {
	return (
		<div>
			<h4 className={clsx(GilroyThin.className, 'mb-2 text-sm md:text-base')}>
				{t(['Графік занять', 'Schedule'])}
			</h4>
			<Mdiv
				initial='hidden'
				whileInView='visible'
				viewport={{ amount: 0.1, once: true }}
				variants={bottomAnimation(0.8, 20)}
			>
				<p
					className={clsx(
						GilroyReg.className,
						'text-sm leading-4 lg:text-base lg:leading-[18px]',
					)}
				>
					{t([scheduleDays, scheduleDaysEng])}
				</p>
				<p
					className={clsx(
						GilroyReg.className,
						'text-sm leading-4 lg:text-base lg:leading-[18px]',
					)}
				>
					{t([scheduleTime, scheduleTimeEng])}
				</p>
			</Mdiv>
		</div>
	);
};

export default StudiosSchedule;
