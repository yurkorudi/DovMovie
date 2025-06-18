export type TSwiperInfo = {
	swiperInfo: { activeIndex: number; slidesCount: number };
};

export type TStudio = {
	createdBy?: {
		name?: string | null;
	};
	createdById?: string;
	name: string;
	nameEng: string;
	description: string;
	descriptionEng: string;
	id?: string;
	contactsName: string;
	contactsNameEng: string;
	contactsPhone: string;
	ageDiapason: string;
	ageDiapasonEng: string;
	scheduleDays: string;
	scheduleDaysEng: string;
	scheduleTime: string;
	scheduleTimeEng: string;
	image?: any;
};
