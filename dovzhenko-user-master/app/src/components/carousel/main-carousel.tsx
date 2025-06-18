'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { nanoid } from 'nanoid';
import { EventTypeEnum, TMainCarouselData } from '@/lib/types/carousel';
import MainCarouselItem from '@/components/carousel/MainCarouselItem';
import React from 'react';
import { useSwiperInfo } from '@/hooks/use-swiper-info';

const MainCarousel = ({ slides }: { slides: TMainCarouselData[] }) => {
	const { handleChangeSlide, swiperInfo } = useSwiperInfo(slides);

	return (
		<Swiper
			spaceBetween={50}
			slidesPerView={1}
			onSlideChange={handleChangeSlide}
			className='h-[calc(100vh-70px)]'
		>
			{slides.length ? (
				<div className='relative'>
					{slides.map((slide) => {
						return (
							<SwiperSlide key={nanoid()} className='bg-main'>
								<MainCarouselItem
									slide={slide}
									slidesCount={slides.length}
									swiperInfo={swiperInfo}
								/>
							</SwiperSlide>
						);
					})}
				</div>
			) : (
				<SwiperSlide key={nanoid()} className='bg-main'>
					<MainCarouselItem
						slide={{
							title: 'Вітаємо на сайті центру Довженка',
							image: '/static/images/back_podii.jpg',
							startTime: '',
							dateForDisplay: '',
							dateForDisplayEng: '',
							titleEng: 'Welcome to the Dovzhenko Center website',
							description: '',
							descriptionEng: '',
							typeImage: EventTypeEnum.PERFORMANCE,
						}}
						isEmpty
					/>
				</SwiperSlide>
			)}
		</Swiper>
	);
};

export default MainCarousel;
