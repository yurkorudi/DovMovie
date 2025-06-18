'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { nanoid } from 'nanoid';
import React from 'react';
import { TAboutUs } from '@/lib/types/about-us';
import { useSwiperInfo } from '@/hooks/use-swiper-info';
import Image from 'next/image';
import { Tenor_Sans } from 'next/font/google';
import clsx from 'clsx';
import localFont from 'next/font/local';
import TeamCarouselArrows from '@/components/about-us/team-carousel-arrows';
import { Navigation } from 'swiper/modules';
import { t } from '@/hooks/use-lang';
import { Mdiv, Mp } from '@/components/motion';
import { bottomAnimation, rightAnimation } from '@/constants/animations';

const tenorSans = Tenor_Sans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const GilroyThin = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const TeamCarousel = ({ slides }: { slides: TAboutUs[] }) => {
	const { handleChangeSlide, swiperInfo } = useSwiperInfo(slides);

	return (
		<div>
			<Swiper
				spaceBetween={50}
				slidesPerView={1}
				onSlideChange={handleChangeSlide}
				modules={[Navigation]}
				navigation={{
					nextEl: '.team-carousel-next',
					prevEl: '.team-carousel-prev',
				}}
			>
				{slides.length ? (
					<div className='relative'>
						{slides.map((slide) => {
							return (
								<SwiperSlide key={nanoid()} className=''>
									<div className='flex flex-col gap-x-8 xl:flex-row'>
										<Mdiv
											initial='hidden'
											whileInView='visible'
											viewport={{ amount: 0.1, once: true }}
											variants={bottomAnimation(0)}
											className='group relative h-[330px] sm:h-[500px] md:h-[290px] md:w-[255px] md:max-w-[255px]'
										>
											<Image
												src={slide.image}
												alt='team image'
												width={255}
												height={290}
												className='absolute top-0 z-10 h-[330px] w-full object-cover transition-all duration-300 group-hover:z-0 group-hover:opacity-0 sm:h-[500px] md:h-[290px] md:max-w-[255px]'
											/>
											<Image
												src={slide.secondImage}
												alt='team image'
												width={255}
												height={290}
												className='absolute top-0 z-0 h-[330px] w-full object-cover transition-all duration-300 group-hover:z-10 group-hover:opacity-100 sm:h-[500px] md:h-[290px] md:max-w-[255px]'
											/>
										</Mdiv>
										<div className='text-white xl:self-end'>
											<div className='mt-[10px] flex gap-x-2 xl:mt-0 xl:block'>
												<Mp
													initial='hidden'
													whileInView='visible'
													viewport={{ amount: 0.1, once: true }}
													variants={rightAnimation(0)}
													className={clsx(
														tenorSans.className,
														'text-xl leading-[23px]',
													)}
												>
													{t([slide.name, slide.nameEng])}
												</Mp>
												<Mp
													initial='hidden'
													whileInView='visible'
													viewport={{ amount: 0.1, once: true }}
													variants={rightAnimation(0)}
													className={clsx(
														tenorSans.className,
														'mb-1.5 text-xl leading-[23px]',
													)}
												>
													{t([slide.surname, slide.surnameEng])}
												</Mp>
											</div>
											<Mp
												initial='hidden'
												whileInView='visible'
												viewport={{ amount: 0.1, once: true }}
												variants={rightAnimation(0.5)}
												className={clsx(
													GilroyThin.className,
													'max-w-[140px] text-base italic leading-[19px]',
												)}
											>
												{t([slide.position, slide.positionEng])}
											</Mp>
										</div>
									</div>
								</SwiperSlide>
							);
						})}
					</div>
				) : (
					<SwiperSlide key={nanoid()} className='bg-main'>
						<div className='text-white'>
							{t(['Контент відсутній', 'No content to show'])}
						</div>
					</SwiperSlide>
				)}
			</Swiper>
			<div className='mt-[44px]'>
				<TeamCarouselArrows swiperInfo={swiperInfo} />
			</div>
		</div>
	);
};

export default TeamCarousel;
