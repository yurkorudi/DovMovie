import dynamic from 'next/dynamic';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

const CarouselArrow = ({
	direction,
	swiperInfo,
	onClick,
}: {
	direction: 'right' | 'left';
	swiperInfo: { activeIndex: number; slidesCount: number };
	onClick?: () => void;
}) => {
	const isBeforeLg = useMediaQuery({ query: '(max-width: 978px)' });
	const isBeforeSm = useMediaQuery({ query: '(max-width: 600px)' });

	const getSize = () => {
		if (isBeforeSm) return { width: 71, height: 16 };
		if (isBeforeLg) return { width: 131, height: 24 };
		else return { width: 147, height: 24 };
	};

	if (direction === 'left') {
		return (
			<svg
				width={getSize().width}
				height={getSize().height}
				viewBox={'0 0 147 16'}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				onClick={onClick}
			>
				<g
					xmlns='http://www.w3.org/2000/svg'
					transform='matrix(-1 0 0 -1 147 16)'
				>
					<path
						d='M146.707 8.70708C147.098 8.31655 147.098 7.68339 146.707 7.29286L140.343 0.928902C139.953 0.538377 139.319 0.538377 138.929 0.928902C138.538 1.31943 138.538 1.95259 138.929 2.34312L144.586 7.99997L138.929 13.6568C138.538 14.0473 138.538 14.6805 138.929 15.071C139.319 15.4616 139.953 15.4616 140.343 15.071L146.707 8.70708ZM0 8.99997H146V6.99997H0V8.99997Z'
						fill='white'
						fillOpacity={swiperInfo.activeIndex !== 0 ? '0.8' : '0.3'}
					/>
				</g>
			</svg>
		);
	}

	if (direction === 'right') {
		return (
			<svg
				width={getSize().width}
				height={getSize().height}
				viewBox='0 0 147 16'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
				onClick={onClick}
			>
				<path
					d='M146.707 8.70708C147.098 8.31655 147.098 7.68339 146.707 7.29286L140.343 0.928902C139.953 0.538377 139.319 0.538377 138.929 0.928902C138.538 1.31943 138.538 1.95259 138.929 2.34312L144.586 7.99997L138.929 13.6568C138.538 14.0473 138.538 14.6805 138.929 15.071C139.319 15.4616 139.953 15.4616 140.343 15.071L146.707 8.70708ZM0 8.99997H146V6.99997H0V8.99997Z'
					fill='white'
					fillOpacity={
						swiperInfo.activeIndex == swiperInfo.slidesCount - 1 ? '0.3' : '0.8'
					}
				/>
			</svg>
		);
	}
};

export default dynamic(() => Promise.resolve(CarouselArrow), { ssr: false });
