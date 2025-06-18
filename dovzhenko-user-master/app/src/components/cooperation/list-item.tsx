'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { CooperationItem } from '@/constants/cooperation';
import { useSwiperInfo } from '@/hooks/use-swiper-info';
import CarouselNavigation from '@/components/cooperation/carousel-navigation';
import type { Swiper as SwiperClass } from 'swiper/types';
import { t } from '@/hooks/use-lang';
import CardTitle from '@/components/cooperation/card-title';
import CardDescription from '@/components/cooperation/card-description';
import CardSpecs from '@/components/cooperation/card-specs';
import Divider from '@/components/cooperation/divider';
import RentButton from '@/components/cooperation/rent-button';

const ListItem = ({
	item,
	onRentClick,
}: {
	item: CooperationItem;
	onRentClick: (id: number) => void;
}) => {
	const swiperRef = useRef<SwiperClass | null>(null);
	const { handleChangeSlide, swiperInfo } = useSwiperInfo(item.images);

	return (
		<div className='relative flex flex-col overflow-hidden'>
			<div>
				<Swiper
					slidesPerView={1}
					className='h-[260px]'
					onSlideChange={handleChangeSlide}
					onSwiper={(swiper) => (swiperRef.current = swiper)}
				>
					{item.images.map((image) => (
						<SwiperSlide key={nanoid()}>
							<img
								src={image}
								alt='image'
								className='h-[260px] w-full object-cover'
							/>
						</SwiperSlide>
					))}
					<CarouselNavigation
						swiperInfo={swiperInfo}
						onClick={(index) => swiperRef?.current?.slideTo(index)}
					/>
				</Swiper>
			</div>
			<div className='flex flex-shrink-0 flex-grow flex-col items-start bg-main-70 px-6 pb-8 pt-4'>
				<CardTitle
					title={t([item.title, item.titleEng])}
					capacity={item.capacity}
				/>
				<CardDescription text={t([item.description, item.descriptionEng])} />
				<CardSpecs
					specs={item.specs}
					title={t(['Характеристики', 'Characteristics'])}
					riderTitle={t(['Технічний райдер', 'Technical rider'])}
					capacity={item.capacity}
					rider={item.rider}
				/>
				<Divider className='my-6 w-full' />
				<RentButton onClick={() => onRentClick(item.id)} />
			</div>
		</div>
	);
};

export default ListItem;
