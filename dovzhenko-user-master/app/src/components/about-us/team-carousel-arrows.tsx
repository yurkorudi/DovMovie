import clsx from 'clsx';
import { TSwiperInfo } from '@/lib/types/studios';
import TeamCarouselArrow from '@/components/about-us/team-carousel-arrow';

const TeamCarouselArrows = ({
	className,
	swiperInfo,
}: { className?: string } & TSwiperInfo) => {
	return (
		<div className={clsx(className, 'flex max-w-[255px] gap-x-16')}>
			<button className='team-carousel-prev' aria-label='Previous slide'>
				<TeamCarouselArrow direction='left' swiperInfo={swiperInfo} />
			</button>
			<button className='team-carousel-next' aria-label='Next slide'>
				<TeamCarouselArrow direction='right' swiperInfo={swiperInfo} />
			</button>
		</div>
	);
};

export default TeamCarouselArrows;
