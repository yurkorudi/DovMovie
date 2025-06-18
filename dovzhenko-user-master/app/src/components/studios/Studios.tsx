'use client';
import LargeContainer from '@/components/containers/large-container';
import { Swiper, SwiperSlide } from 'swiper/react';
import SmallInnerContainer from '@/components/containers/small-container';
import { Navigation } from 'swiper/modules';
import React from 'react';
import StudiosTitleNavigations from '@/components/studios/studios-title-navigations';
import StudiosSlide from '@/components/studios/studios-slide';
import DividerLine from '@/components/DividerLine';
import StudiosTitle from '@/components/studios/studios-title';
import { TStudio } from '@/lib/types/studios';
import { useSwiperInfo } from '@/hooks/use-swiper-info';

const Studios = ({ studios }: { studios: TStudio[] }) => {
	const { handleChangeSlide, swiperInfo } = useSwiperInfo(studios);

	return (
		<>
			<a id='studios'></a>
			<div className='flex bg-secondary py-8'>
				<LargeContainer>
					<SmallInnerContainer>
						<StudiosTitle className='mb-[15px] !text-start md:hidden' />
						<StudiosTitleNavigations
							className='mb-8 hidden items-center justify-between md:flex xl:hidden'
							swiperInfo={swiperInfo}
						/>
						<div className='flex'>
							<Swiper
								spaceBetween={60}
								slidesPerView={1}
								modules={[Navigation]}
								onSlideChange={handleChangeSlide}
								navigation={{
									nextEl: '.studios-next',
									prevEl: '.studios-prev',
								}}
							>
								{studios.map((studio) => (
									<SwiperSlide key={studio.id}>
										<StudiosSlide studio={studio} />
									</SwiperSlide>
								))}
							</Swiper>
							<StudiosTitleNavigations
								className='ml-[30px] hidden xl:block'
								arrowsClassName='mt-[80px]'
								swiperInfo={swiperInfo}
							/>
						</div>
						<DividerLine className='mt-5 md:hidden' />
						<div className='flex justify-center md:hidden'>
							<StudiosTitleNavigations
								className='mt-8 flex items-center justify-between '
								swiperInfo={swiperInfo}
								title={false}
							/>
						</div>
					</SmallInnerContainer>
				</LargeContainer>
			</div>
		</>
	);
};

export default Studios;
