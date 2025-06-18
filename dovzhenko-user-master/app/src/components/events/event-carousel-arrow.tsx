import React from 'react';
import { TSwiperInfo } from '@/lib/types/studios';

const EventCarouselArrow = ({
	direction,
	swiperInfo,
}: {
	direction: 'right' | 'left';
} & TSwiperInfo) => {
	if (direction === 'left') {
		return (
			<svg
				width='66'
				height='16'
				viewBox='0 0 66 16'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M0.292893 7.29289C-0.0976333 7.68341 -0.0976334 8.31658 0.292892 8.7071L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6568L2.41422 7.99999L8.07107 2.34314C8.46159 1.95262 8.46159 1.31945 8.07107 0.928927C7.68054 0.538403 7.04738 0.538403 6.65685 0.928927L0.292893 7.29289ZM66 7L1 6.99999L1 8.99999L66 9L66 7Z'
					fill='white'
					fillOpacity={swiperInfo.activeIndex !== 0 ? '0.8' : '0.3'}
				></path>
			</svg>
		);
	}

	if (direction === 'right') {
		return (
			<svg
				width='66'
				height='16'
				viewBox='0 0 66 16'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M65.7071 8.70711C66.0976 8.31659 66.0976 7.68342 65.7071 7.2929L59.3431 0.928937C58.9526 0.538413 58.3195 0.538413 57.9289 0.928937C57.5384 1.31946 57.5384 1.95263 57.9289 2.34315L63.5858 8.00001L57.9289 13.6569C57.5384 14.0474 57.5384 14.6805 57.9289 15.0711C58.3195 15.4616 58.9526 15.4616 59.3431 15.0711L65.7071 8.70711ZM-8.74228e-08 9L65 9.00001L65 7.00001L8.74228e-08 7L-8.74228e-08 9Z'
					fill='white'
					fillOpacity={
						swiperInfo.activeIndex === swiperInfo.slidesCount - 1
							? '0.3'
							: '0.8'
					}
				></path>
			</svg>
		);
	}
};

export default EventCarouselArrow;
