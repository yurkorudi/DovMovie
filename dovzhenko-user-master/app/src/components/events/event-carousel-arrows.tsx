import EventCarouselArrow from '@/components/events/event-carousel-arrow';
import React from 'react';
import clsx from 'clsx';
import { TSwiperInfo } from '@/lib/types/studios';

const EventCarouselArrows = ({
	className,
	swiperInfo,
}: {
	className?: string;
} & TSwiperInfo) => {
	return (
		<div className={clsx('flex gap-x-[30px]', className)}>
			<button className='studios-prev' aria-label='Previous slide'>
				<EventCarouselArrow direction='left' swiperInfo={swiperInfo} />
			</button>
			<button className='studios-next' aria-label='Next slide'>
				<EventCarouselArrow direction='right' swiperInfo={swiperInfo} />
			</button>
		</div>
	);
};

export default EventCarouselArrows;
