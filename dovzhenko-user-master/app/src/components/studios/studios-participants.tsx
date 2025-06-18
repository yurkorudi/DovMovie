import clsx from 'clsx';
import React from 'react';
import localFont from 'next/font/local';
import { t } from '@/hooks/use-lang';
import { bottomAnimation } from '@/constants/animations';
import { Mp } from '@/components/motion';

const GilroyThin = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const GilroyReg = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const StudiosParticipants = ({
	ageDiapason,
	ageDiapasonEng,
}: {
	ageDiapason: string;
	ageDiapasonEng: string;
}) => {
	return (
		<div>
			<h4
				className={clsx(
					GilroyThin.className,
					'2sm:mb-1.5, text-sm md:text-base',
				)}
			>
				{t(['Вік', 'Age'])}
			</h4>
			<Mp
				initial='hidden'
				whileInView='visible'
				viewport={{ amount: 0.1, once: true }}
				variants={bottomAnimation(0.4, 30)}
				className={clsx(
					GilroyReg.className,
					'text-sm leading-4 lg:text-base lg:leading-[18px]',
				)}
			>
				{t([ageDiapason, ageDiapasonEng])}
			</Mp>
		</div>
	);
};

export default StudiosParticipants;
