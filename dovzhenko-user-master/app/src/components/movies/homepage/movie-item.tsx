'use client';
import { TMovie } from '@/lib/types/movies';
import { Marticle } from '@/components/motion';
import { nanoid } from 'nanoid';
import { equalizerVariants } from '@/constants/animations';
import clsx from 'clsx';
import { t } from '@/hooks/use-lang';
import DividerLine from '@/components/DividerLine';
import Link from 'next/link';
import { Forum, Tenor_Sans } from 'next/font/google';
import localFont from 'next/font/local';

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

const GilroyRegular = localFont({
	src: '../../../../public/fonts/Gilroy-Regular.woff',
});

const MovieItem = ({ movie, index }: { movie: TMovie; index: number }) => {
	return (
		<Marticle
			key={nanoid()}
			custom={index}
			initial='hidden'
			whileInView='visible'
			viewport={{ amount: 0.6, once: true }}
			variants={equalizerVariants}
			style={{
				backgroundImage: `linear-gradient(rgb(37, 20, 71) 0%, rgba(43, 29, 112, 0.4) 60%, rgba(37, 20, 71, 0.7) 72.4%, rgb(37, 20, 71) 100%), url("${movie.poster}")`,
			}}
			className={clsx(
				'group relative h-[289px] w-full max-w-[350px] overflow-hidden bg-cover px-6 pb-[27px] pt-5 xl:h-[350px]',
			)}
		>
			<div className='flex h-full flex-col'>
				<div className='mt-auto'>
					<h3
						className={clsx(
							tenorSans.className,
							'max-w-full text-[21px] uppercase leading-[37px] text-gold',
						)}
					>
						{t([movie.title, movie.titleEng])}
					</h3>
					{/*<p*/}
					{/*	className={clsx(*/}
					{/*		GilroyThin.className,*/}
					{/*		'pt-[10px] text-[15.4px] italic leading-[23px] text-white',*/}
					{/*	)}*/}
					{/*>*/}
					{/*	{t([startDateString, startDateStringEng])}*/}
					{/*</p>*/}
				</div>
			</div>
			<div className='absolute left-0 top-0 flex h-full w-full translate-y-[100%] transform flex-col bg-event px-[26px] pt-5 text-white transition-all duration-300 group-hover:translate-y-0'>
				<div>
					{/*<h4*/}
					{/*	className={clsx(*/}
					{/*		tenorSans.className,*/}
					{/*		'text-[18px] uppercase leading-[21px]',*/}
					{/*	)}*/}
					{/*>*/}
					{/*	{t([defineHoverTitle(typeImage), defineHoverTitleEng(typeImage)])}*/}
					{/*</h4>*/}
					<p
						className={clsx(
							GilroyRegular.className,
							'mt-5 max-w-[280px] text-[14px] leading-[16px]',
						)}
					>
						{String(t([movie.description, movie.descriptionEng])).slice(0, 467)}
					</p>
				</div>
				<div className={clsx(ForumSans.className, 'mt-auto pb-[27px]')}>
					<DividerLine className='mb-[25px]' />
					<Link
						href={`${process.env.NEXT_PUBLIC_TICKET_APP_URL}/buy?movie_id=${movie.id}`}
						target='_blank'
						className='uppercase text-gold underline hover:text-gold-hover'
					>
						{t(['Купити квиток', 'Buy ticket'])}
					</Link>
				</div>
			</div>
		</Marticle>
	);
};

export default MovieItem;
