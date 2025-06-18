export enum ApplicationType {
	SUBCATCH = 'SUBCATCH',
	EARCATCH = 'EARCATCH',
	GRETA = 'GRETA',
	MOVIEREADING = 'MOVIEREADING',
	PODYV = 'PODYV',
}

export type TShowtime = {
	id: string;
	dateTime: Date;
	movieId: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TMovie = {
	id: string;
	title: string;
	titleEng: string;
	age: string;
	genre: string;
	genreEng: string;
	filmMaker: string;
	filmMakerEng: string;
	country: string;
	countryEng: string;
	duration: string;
	description: string;
	descriptionEng: string;
	trailerLink: string;
	ticketLink: string;
	showtimes: TShowtime[];
	applications: string;
	poster: string;
	price: string;
};
