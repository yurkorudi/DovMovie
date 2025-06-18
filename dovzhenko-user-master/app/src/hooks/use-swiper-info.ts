import { useState } from 'react';
import { TSwiperInfoProps } from '@/lib/types/carousel';
import type { Swiper as SwiperClass } from 'swiper/types';

export const useSwiperInfo = (slides: any[]) => {
	const [swiperInfo, setSwiperInfo] = useState<TSwiperInfoProps>({
		slidesCount: slides.length,
		activeIndex: 0,
	});

	const handleChangeSlide = (swiper: SwiperClass) => {
		setSwiperInfo({
			slidesCount: slides.length,
			activeIndex: swiper.activeIndex,
		});
	};

	return {
		handleChangeSlide,
		swiperInfo,
	};
};
