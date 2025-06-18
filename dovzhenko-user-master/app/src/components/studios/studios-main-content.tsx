import clsx from 'clsx';
import DividerLine from '@/components/DividerLine';
import React from 'react';
import localFont from 'next/font/local';
import Image from 'next/image';
import { t } from '@/hooks/use-lang';
import { Mh2, Mp } from '@/components/motion';
import { bottomAnimation } from '@/constants/animations';

const GilroyBold = localFont({
	src: '../../../public/fonts/Gilroy-Bold.woff',
});

const GilroyThin = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const GilroyReg = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const StudiosMainContent = ({
	name,
	nameEng,
	image,
	description,
	descriptionEng,
}: {
	name: string;
	nameEng: string;
	image: string;
	description: string;
	descriptionEng: string;
}) => {
	return (
		<>
			<Mh2
				initial='hidden'
				whileInView='visible'
				viewport={{ amount: 0.2, once: true }}
				variants={bottomAnimation()}
				className={clsx(GilroyBold.className, 'text-2xl uppercase')}
			>
				{t([name, nameEng])}
			</Mh2>
			<DividerLine className='mb-6 mt-4 md:my-[30px]' />
			<div className='mb-[21px] md:hidden'>
				<Image
					src={image}
					alt='studios image'
					width={255}
					height={245}
					className='h-[247px] min-w-full object-cover'
				/>
			</div>
			<h3
				className={clsx(
					GilroyThin.className,
					'text-md mb-1.5 leading-[18.45px]',
				)}
			>
				{t(['Опис', 'Description'])}
			</h3>
			<Mp
				initial='hidden'
				whileInView='visible'
				viewport={{ amount: 0.1, once: true }}
				variants={bottomAnimation()}
				className={clsx(GilroyReg.className, 'text-[18px] leading-[21.19px]')}
			>
				{t([description, descriptionEng])}
			</Mp>
		</>
	);
};

export default StudiosMainContent;
