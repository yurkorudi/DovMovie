import DividerLine from '@/components/DividerLine';
import clsx from 'clsx';
import { TEvent } from '@/lib/types/events';
import EventItem from '@/components/events/event-item';
import { nanoid } from 'nanoid';
import LargeContainer from '@/components/containers/large-container';
import initTranslations from '@/app/i18n';
import TranslationsProvider from '@/providers/TranslatorProvider';
import SmallInnerContainer from '@/components/containers/small-container';
import backgroundImage from 'app/public/static/images/event_back.webp';

const nameSpaces = ['common'];

const EventList = async ({
	events,
	locale,
}: {
	events: TEvent[];
	locale: string;
}) => {
	const { t, resources } = await initTranslations(locale, nameSpaces);

	return (
		<TranslationsProvider
			locale={locale}
			resources={resources}
			namespaces={nameSpaces}
		>
			<a id='events'></a>
			<div
				className='relative py-20'
				style={{
					background: `url(${backgroundImage.src}) 0 0 / cover no-repeat #291666`,
					backgroundBlendMode: 'luminosity',
				}}
			>
				<DividerLine
					className='absolute top-[140px] -mt-2.5'
					title={t('events')}
				/>
				<LargeContainer>
					<SmallInnerContainer>
						<div
							className={clsx(
								'mt-[50px] grid grid-cols-1 place-items-center gap-[30px] sm:grid-cols-2 md:grid-cols-3',
							)}
						>
							{events.map((event, index) => (
								<EventItem
									index={index}
									key={nanoid()}
									typeImage={event.typeImage}
									title={event.title}
									titleEng={event.titleEng}
									startTime={event.startTime}
									cardDescription={event.cardDescription}
									cardDescriptionEng={event.cardDescriptionEng}
									link={event.link}
									backgroundImage={event.backgroundImage}
									startDateString={event.startDateString}
									startDateStringEng={event.startDateStringEng}
									freeEntry={event.freeEntry}
									buyTicketText={
										event.freeEntry ? t('freeEntry') : t('buyTicket')
									}
								/>
							))}
						</div>
					</SmallInnerContainer>
				</LargeContainer>
			</div>
		</TranslationsProvider>
	);
};

export default EventList;
