'use client';
import React from 'react';
import LargeContainer from '@/components/containers/large-container';
import Image from 'next/image';
import { TMainCarouselData, TSwiperInfoProps } from '@/lib/types/carousel';
import localFont from 'next/font/local';
import { defineImage, defineMobileImage } from '@/lib/constants/events';
import clsx from 'clsx';
import { t } from '@/hooks/use-lang';
import { Tenor_Sans } from 'next/font/google';
import Link from 'next/link';
import { useSwiper } from 'swiper/react';
import CarouselArrow from '@/components/carousel/carousel-arrow';
import { nanoid } from 'nanoid';
import ContactsIcons from '@/components/contacts-icons';
import { Mdiv, Mh1, Mp } from '@/components/motion';
import {
	rightAnimation,
	leftAnimation,
	topAnimation,
} from '@/constants/animations';

const GilroyRegular = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const tenorSans = Tenor_Sans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const MainCarouselItem = ({
	slide,
	isEmpty,
	slidesCount,
	swiperInfo,
}: {
	slide: Omit<TMainCarouselData, 'id' | 'createdById' | 'order'>;
	isEmpty?: boolean;
	slidesCount?: number;
	swiperInfo?: TSwiperInfoProps;
}) => {
	const swiper = useSwiper();
	const slidesCountArray =
		slidesCount && Array.from({ length: slidesCount }, (_, i) => i);

	const handlePrevSlide = () => swiper.slidePrev();
	const handleNextSlide = () => swiper.slideNext();

	return (
		<div className='relative h-full'>
			<div
				className='absolute bottom-0 left-0 right-0 top-0 bg-cover bg-center bg-no-repeat'
				style={{
					backgroundImage: `linear-gradient(90deg, rgb(41, 22, 102) 0%, rgba(42, 21, 94, 0.5) 100%), url("${slide.image}")`,
				}}
			>
				<LargeContainer className='h-full'>
					<div
						className={clsx('flex h-full flex-grow', {
							'md:items-center': !isEmpty,
							'mt-16': isEmpty,
						})}
					>
						<div className='flex-grow lg:flex'>
							{/*Type Image*/}
							<div
								className={clsx('my-[62px] lg:my-0', {
									'md:my-[94px]': !isEmpty,
								})}
							>
								{slide.typeImage && !isEmpty && (
									<Image
										src={defineImage(slide.typeImage)}
										alt='event type image'
										width={29}
										height={554}
										className='hidden lg:inline'
									/>
								)}
								{slide.typeImage && !isEmpty && (
									<Image
										src={defineMobileImage(slide.typeImage)}
										alt='event type image'
										width={554}
										height={29}
										className='lg:hidden'
									/>
								)}
							</div>
							<div className='flex flex-grow flex-col justify-between lg:ml-[40px] xl:ml-[100px] 1xl:ml-[150px]'>
								<div>
									{/*Date*/}
									<Mp
										initial='hidden'
										whileInView='visible'
										viewport={{ amount: 0.2, once: true }}
										variants={leftAnimation(0.3)}
										className={clsx(
											GilroyRegular.className,
											'relative mb-[26px] text-[18px] italic leading-[26px] text-white md:mb-[63px] md:text-[26px] lg:mb-[50px]',
										)}
									>
										{t([slide.dateForDisplay, slide.dateForDisplayEng])}
										<span className='absolute right-0 top-0 hidden lg:block'>
											<ContactsIcons />
										</span>
									</Mp>
									{/*Title*/}
									<Mh1
										initial='hidden'
										whileInView='visible'
										viewport={{ amount: 0.2, once: true }}
										variants={rightAnimation(0.5)}
										className={clsx(
											'mb-6 max-w-[600px] text-[36px] uppercase leading-[42px] text-gold md:text-[50px] md:leading-[58px] lg:mb-[40px] lg:text-[80px] lg:leading-[90px]',
											tenorSans.className,
										)}
									>
										{t([slide.title, slide.titleEng])}
									</Mh1>
									{/*Description*/}
									<Mp
										initial='hidden'
										whileInView='visible'
										viewport={{ amount: 0.2, once: true }}
										variants={leftAnimation(0.7)}
										className='mb-[42px] max-w-[330px] text-[14px] leading-[16px] text-white md:text-[22px] md:leading-[25px]'
									>
										{t([slide.description, slide.descriptionEng])}
									</Mp>
								</div>
								{/*BUY TICKET*/}
								<Mdiv
									initial='hidden'
									whileInView='visible'
									viewport={{ amount: 0.2, once: true }}
									variants={topAnimation(0.9)}
									className='relative justify-between lg:flex'
								>
									{slide.link ? (
										<Link
											href={slide.link}
											target='_blank'
											className={clsx(
												'uppercase text-gold underline hover:text-gold-hover',
											)}
										>
											{t([slide.linkTitle, slide.linkTitleEng])}
										</Link>
									) : (
										<span
											className={clsx('uppercase text-white', {
												hidden: isEmpty,
											})}
										>
											ВІЛЬНИЙ ВХІД
										</span>
									)}
									{slidesCount &&
										slidesCount > 1 &&
										slidesCountArray &&
										swiperInfo && (
											<div className='mt-[57px] flex items-center justify-center text-white md:mt-[130px] lg:mt-0'>
												<button onClick={handlePrevSlide}>
													<CarouselArrow
														direction='left'
														swiperInfo={swiperInfo}
													/>
												</button>
												<div className='mx-[26px] flex items-center'>
													{slidesCountArray.map((_, index) => (
														<span
															key={nanoid()}
															className={clsx('inline-block h-6 bg-white/70', {
																'mr-8': index !== slidesCountArray.length - 1,
																'h-6 w-0.5 bg-white':
																	swiperInfo?.activeIndex === index,
																'h-[20px] w-px bg-white/70':
																	swiperInfo?.activeIndex !== index,
															})}
														></span>
													))}
												</div>
												<button onClick={handleNextSlide}>
													<CarouselArrow
														direction='right'
														swiperInfo={swiperInfo}
													/>
												</button>
											</div>
										)}
								</Mdiv>
							</div>
						</div>
					</div>
				</LargeContainer>
			</div>
		</div>
	);
};

export default MainCarouselItem;
