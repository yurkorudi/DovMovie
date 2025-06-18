export enum EventTypeEnum {
	KINO = 'KINO',
	MUSIC = 'MUSIC',
	PERFORMANCE = 'PERFORMANCE',
	THEATER = 'THEATER',
	TALKS = 'TALKS',
	STANDUP = 'STANDUP',
}

export type TMainCarouselData = {
	id: string;
	startTime: string;
	dateForDisplay: string;
	dateForDisplayEng: string;
	title: string;
	titleEng: string;
	description: string;
	descriptionEng: string;
	image: string;
	link?: string;
	linkTitle?: string;
	linkTitleEng?: string;
	typeImage: EventTypeEnum;
	order: string;
	createdById: string;
};

export type TSwiperInfoProps = {
	isEnd?: boolean;
	slidesCount: number;
	activeIndex: number;
};
