import { TSwiperInfo } from '@/lib/types/studios';

const TeamCarouselArrow = ({
	direction,
	swiperInfo,
}: { direction: 'left' | 'right' } & TSwiperInfo) => {
	if (direction === 'right') {
		return (
			<svg
				width='96'
				height='16'
				viewBox='0 0 96 16'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M95.7071 8.7071C96.0976 8.31657 96.0976 7.68341 95.7071 7.29288L89.3431 0.928924C88.9526 0.5384 88.3195 0.5384 87.9289 0.928925C87.5384 1.31945 87.5384 1.95261 87.9289 2.34314L93.5858 7.99999L87.9289 13.6568C87.5384 14.0474 87.5384 14.6805 87.9289 15.0711C88.3195 15.4616 88.9526 15.4616 89.3431 15.0711L95.7071 8.7071ZM8.74228e-08 9L95 8.99999L95 6.99999L-8.74228e-08 7L8.74228e-08 9Z'
					fill='white'
					fillOpacity={
						swiperInfo.activeIndex === swiperInfo.slidesCount - 1
							? '0.3'
							: '0.6'
					}
				></path>
			</svg>
		);
	}

	return (
		<svg
			width='95'
			height='16'
			viewBox='0 0 95 16'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M0.292892 7.29289C-0.0976334 7.68342 -0.0976334 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41422 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292892 7.29289ZM95 7L1 7V9L95 9V7Z'
				fill='white'
				fillOpacity={swiperInfo.activeIndex !== 0 ? '0.6' : '0.3'}
			></path>
		</svg>
	);
};

export default TeamCarouselArrow;
