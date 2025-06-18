import { TSwiperInfo } from '@/lib/types/studios';
import clsx from 'clsx';
import { nanoid } from 'nanoid';

const CarouselNavigation = ({
	className,
	swiperInfo,
	onClick,
}: { className?: string; onClick: (index: number) => void } & TSwiperInfo) => {
	const slidesCountArray = Array.from(
		{ length: swiperInfo.slidesCount },
		(_, i) => i,
	);

	return (
		<div
			className={clsx(
				className,
				'absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 transform gap-x-4',
			)}
		>
			{slidesCountArray.map((a, index) => (
				<button
					key={nanoid()}
					className={clsx('h-0.5 w-10 bg-white/70', {
						'!bg-white': swiperInfo.activeIndex === index,
					})}
					aria-label='Slide'
					onClick={() => onClick(index)}
				/>
			))}
		</div>
	);
};

export default CarouselNavigation;
