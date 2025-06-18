import clsx from 'clsx';
import React from 'react';
import localFont from 'next/font/local';
import { t } from '@/hooks/use-lang';
import { Mh2 } from '@/components/motion';
import { rightAnimation } from '@/constants/animations';

const GilroyBold = localFont({
	src: '../../../public/fonts/Gilroy-Bold.woff',
});

const StudiosTitle = ({ className }: { className?: string }) => {
	return (
		<Mh2
			initial='hidden'
			whileInView='visible'
			viewport={{ amount: 0.1, once: true }}
			variants={rightAnimation(1)}
			className={clsx(
				GilroyBold.className,
				'text-end text-[60px] uppercase leading-[73px] text-secondary-light',
				className,
			)}
		>
			{t(['студії', 'studios'])}
		</Mh2>
	);
};

export default StudiosTitle;
