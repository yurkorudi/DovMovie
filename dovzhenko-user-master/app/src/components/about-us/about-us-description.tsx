import clsx from 'clsx';
import Image from 'next/image';
import MainImage from '@/images/main.webp';
import React from 'react';
import localFont from 'next/font/local';
import { Mdiv, Mp } from '@/components/motion';
import { rightAnimation } from '@/constants/animations';

const GilroyRegular = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const AboutUsDescription = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => {
	return (
		<div className='mt-[10px] md:w-3/5 lg:w-2/5'>
			<Mp
				initial='hidden'
				whileInView='visible'
				viewport={{ amount: 0.1, once: true }}
				variants={rightAnimation(0)}
				className={clsx(GilroyRegular.className, 'text-base text-white/80')}
			>
				{title}
			</Mp>
			<Mp
				initial='hidden'
				whileInView='visible'
				viewport={{ amount: 0.1, once: true }}
				variants={rightAnimation(0.5)}
				className={clsx(
					GilroyRegular.className,
					'mt-[33px] text-base text-white/80 md:max-w-[415px]',
				)}
			>
				{description}
			</Mp>
			<Mdiv
				initial='hidden'
				whileInView='visible'
				viewport={{ amount: 0.1, once: true }}
				variants={rightAnimation(0.8)}
				className='hidden md:block'
			>
				<Image
					src={MainImage}
					alt='mian image'
					width={445}
					height={226}
					className='mt-[33px] max-h-[226px] object-cover'
				/>
			</Mdiv>
		</div>
	);
};

export default AboutUsDescription;
