import { EventTypeEnum } from '@/lib/types/carousel';

export type TEvent = {
	typeImage: EventTypeEnum;
	title: string;
	titleEng: string;
	cardDescription: string;
	cardDescriptionEng: string;
	startTime: string;
	link: string;
	backgroundImage: any;
	startDateString: string;
	startDateStringEng: string;
	freeEntry: boolean;
};
