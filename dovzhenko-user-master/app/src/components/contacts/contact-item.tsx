'use client';
import clsx from 'clsx';
import { Tenor_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { Mh4 } from '@/components/motion';
import { bottomAnimation } from '@/constants/animations';
import { t } from '@/hooks/use-lang';

const tenorSans = Tenor_Sans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const GilroyRegular = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const ContactItem = ({
	title,
	text,
	textEng,
	animationDelay,
}: {
	title: string;
	text: string;
	textEng: string;
	animationDelay: number;
}) => {
	return (
		<div>
			<h3
				className={clsx(
					tenorSans.className,
					'mb-2 text-center text-[18px] leading-[21px] text-gold/70',
				)}
			>
				{title}
			</h3>
			<Mh4
				initial='hidden'
				whileInView='visible'
				viewport={{ amount: 0.1, once: true }}
				variants={bottomAnimation(animationDelay, 30)}
				className={clsx(
					'text-center text-[18px] italic leading-[21px] text-gold',
					GilroyRegular.className,
				)}
			>
				{t([text, textEng])}
			</Mh4>
		</div>
	);
};

export default ContactItem;
