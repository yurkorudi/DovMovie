import clsx from 'clsx';
import React from 'react';
import localFont from 'next/font/local';
import { t } from '@/hooks/use-lang';
import { Mdiv } from '@/components/motion';
import { bottomAnimation } from '@/constants/animations';

const GilroyBold = localFont({
	src: '../../../public/fonts/Gilroy-Bold.woff',
});

const GilroyThin = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const StudiosContacts = ({
	contactsName,
	contactsNameEng,
	contactsPhone,
}: {
	contactsName: string;
	contactsNameEng: string;
	contactsPhone: string;
}) => {
	return (
		<div>
			<h4
				className={clsx(
					GilroyThin.className,
					'mb-[11px] text-sm 2sm:mb-1.5 md:text-base',
				)}
			>
				{t(['Контакти', 'Contacts'])}
			</h4>
			<Mdiv
				initial='hidden'
				whileInView='visible'
				viewport={{ amount: 0.1, once: true }}
				variants={bottomAnimation(0, 30)}
			>
				<p
					className={clsx(
						GilroyBold.className,
						'text-sm leading-4 lg:text-base lg:leading-[18px]',
					)}
				>
					{t([contactsName, contactsNameEng])}
				</p>
				<p
					className={clsx(
						GilroyBold.className,
						'text-sm leading-4 lg:text-base lg:leading-[18px]',
					)}
				>
					{contactsPhone}
				</p>
			</Mdiv>
		</div>
	);
};

export default StudiosContacts;
