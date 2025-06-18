'use client';
import { EventTypeEnum } from '@/lib/types/carousel';
import { defineMobileImage } from '@/lib/constants/events';
import clsx from 'clsx';
import { TEvent } from '@/lib/types/events';
import { Tenor_Sans, Forum } from 'next/font/google';
import localFont from 'next/font/local';
import { defineHoverTitle, defineHoverTitleEng } from '@/lib/constants/events';
import DividerLine from '@/components/DividerLine';
import Link from 'next/link';
import { t } from '@/hooks/use-lang';
import { Marticle } from '@/components/motion';
import { nanoid } from 'nanoid';
import { equalizerVariants } from '@/constants/animations';

const tenorSans = Tenor_Sans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});
const ForumSans = Forum({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const GilroyThin = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const GilroyRegular = localFont({
	src: '../../../public/fonts/Gilroy-Regular.woff',
});

const EventItem = ({
	typeImage = EventTypeEnum.PERFORMANCE,
	title,
	titleEng,
	startDateString,
	startDateStringEng,
	cardDescription,
	cardDescriptionEng,
	link,
	backgroundImage,
	buyTicketText,
	freeEntry,
	index,
}: TEvent & { buyTicketText: string; index: number }) => {
	return (
		<Marticle
			key={nanoid()}
			custom={index}
			initial='hidden'
			whileInView='visible'
			viewport={{ amount: 0.6, once: true }}
			variants={equalizerVariants}
			style={{
				backgroundImage: `linear-gradient(rgb(37, 20, 71) 0%, rgba(43, 29, 112, 0.4) 60%, rgba(37, 20, 71, 0.7) 72.4%, rgb(37, 20, 71) 100%), url("${backgroundImage}")`,
			}}
			className={clsx(
				'group relative h-[289px] w-full max-w-[350px] overflow-hidden bg-cover px-6 pb-[27px] pt-5 xl:h-[350px]',
			)}
		>
			<div className='flex h-full flex-col'>
				<div>
					<img
						src={defineMobileImage(typeImage)}
						alt='image type'
						className={clsx(
							{ 'min-h-[20px]': typeImage === EventTypeEnum.PERFORMANCE },
							'max-h-[25px] w-auto',
						)}
					/>
				</div>
				<div className='mt-auto'>
					<h3
						className={clsx(
							tenorSans.className,
							'max-w-[230px] text-[21px] uppercase leading-[37px] text-gold',
						)}
					>
						{t([title, titleEng])}
					</h3>
					<p
						className={clsx(
							GilroyThin.className,
							'pt-[10px] text-[15.4px] italic leading-[23px] text-white',
						)}
					>
						{t([startDateString, startDateStringEng])}
					</p>
				</div>
			</div>
			<div className='absolute left-0 top-0 flex h-full w-full translate-y-[100%] transform flex-col bg-event px-[26px] pt-5 text-white transition-all duration-300 group-hover:translate-y-0'>
				<div>
					<h4
						className={clsx(
							tenorSans.className,
							'text-[18px] uppercase leading-[21px]',
						)}
					>
						{t([defineHoverTitle(typeImage), defineHoverTitleEng(typeImage)])}
					</h4>
					<p
						className={clsx(
							GilroyRegular.className,
							'mt-5 max-w-[280px] text-[14px] leading-[16px]',
						)}
					>
						{t([cardDescription, cardDescriptionEng])}
					</p>
				</div>
				<div className={clsx(ForumSans.className, 'mt-auto pb-[27px]')}>
					<DividerLine className='mb-[25px]' />
					{freeEntry ? (
						<span className='uppercase text-white'>{buyTicketText}</span>
					) : (
						<Link
							href={link}
							target='_blank'
							className='uppercase text-gold underline hover:text-gold-hover'
						>
							{buyTicketText}
						</Link>
					)}
				</div>
			</div>
		</Marticle>
	);
};

export default EventItem;
