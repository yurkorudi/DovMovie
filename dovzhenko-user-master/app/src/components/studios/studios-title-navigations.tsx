import clsx from 'clsx';
import EventCarouselArrows from '@/components/events/event-carousel-arrows';
import React from 'react';
import { TSwiperInfo } from '@/lib/types/studios';
import StudiosTitle from '@/components/studios/studios-title';

const StudiosTitleNavigations = ({
	swiperInfo,
	className,
	arrowsClassName,
	title = true,
}: {
	className?: string;
	arrowsClassName?: string;
	title?: boolean;
} & TSwiperInfo) => {
	return (
		<div className={className}>
			{title && <StudiosTitle />}
			<div className='flex'>
				<EventCarouselArrows
					className={clsx(arrowsClassName)}
					swiperInfo={swiperInfo}
				/>
			</div>
		</div>
	);
};

export default StudiosTitleNavigations;
