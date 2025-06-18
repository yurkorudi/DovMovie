import StudiosMainContent from '@/components/studios/studios-main-content';
import StudiosContacts from '@/components/studios/studios-contacts';
import StudiosParticipants from '@/components/studios/studios-participants';
import StudiosSchedule from '@/components/studios/studios-schedule';
import Image from 'next/image';
import React from 'react';
import { TStudio } from '@/lib/types/studios';

const StudiosSlide = ({ studio }: { studio: TStudio }) => {
	return (
		<div className='flex'>
			<div className='text-white'>
				<StudiosMainContent
					name={studio.name}
					nameEng={studio.nameEng}
					image={studio.image}
					description={studio.description}
					descriptionEng={studio.descriptionEng}
				/>
				<div className='mt-[17px] flex flex-col gap-y-[17px] 2sm:mt-[35px] 2sm:flex-row 2sm:justify-between'>
					<StudiosContacts
						contactsName={studio.contactsName}
						contactsNameEng={studio.contactsNameEng}
						contactsPhone={studio.contactsPhone}
					/>
					<StudiosParticipants
						ageDiapason={studio.ageDiapason}
						ageDiapasonEng={studio.ageDiapasonEng}
					/>
					<StudiosSchedule
						scheduleDays={studio.scheduleDays}
						scheduleDaysEng={studio.scheduleDaysEng}
						scheduleTime={studio.scheduleTime}
						scheduleTimeEng={studio.scheduleTimeEng}
					/>
				</div>
			</div>
			<div className='ml-[30px] hidden md:block'>
				<Image
					src={studio.image}
					alt='studios image'
					width={255}
					height={247}
					className='max-h-[247px] min-h-[247px] min-w-[255px] object-cover'
				/>
			</div>
		</div>
	);
};

export default StudiosSlide;
