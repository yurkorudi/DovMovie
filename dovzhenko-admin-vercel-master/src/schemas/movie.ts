import { z } from 'zod';
import { baseImageSchema } from '@/schemas/base';

export const ShowtimeSchema = z.object({
	id: z.string(),
	dateTime: z.date(),
	movieId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export const MovieResponseSchema = z.object({
	title: z.string(),
	titleEng: z.string(),
	age: z.string(),
	genre: z.string(),
	genreEng: z.string(),
	filmMaker: z.string(),
	filmMakerEng: z.string(),
	country: z.string(),
	countryEng: z.string(),
	duration: z.string(),
	description: z.string(),
	descriptionEng: z.string(),
	trailerLink: z.string(),
	ticketLink: z.string(),
	showtimes: z.array(ShowtimeSchema).optional(),
	applications: z.any(),
	poster: z.string(),
	price: z.string(),
});

export const MovieFormSchema = z.object({
	title: z.string().min(1, 'Назва фільму не може бути порожньою'),
	titleEng: z.string().min(1, 'Назва фільму англ не може бути порожньою'),
	age: z.string().min(1, 'Вік не може бути порожнім'),
	genre: z.string().min(3, 'Жанр не може бути порожнім'),
	genreEng: z.string().min(3, 'Жанр англ не може бути порожнім'),
	filmMaker: z.string().min(3, 'Режисер не може бути порожнім'),
	filmMakerEng: z.string().min(3, 'Режисер англ не може бути порожнім'),
	country: z.string().min(3, 'Країна не може бути порожньою'),
	countryEng: z.string().min(3, 'Країна англ не може бути порожньою'),
	duration: z.string().min(2, 'Тривалість не може бути порожньою'),
	description: z.string().min(3, 'Опис не може бути порожнім'),
	descriptionEng: z.string().min(3, 'Опис англ не може бути порожнім'),
	trailerLink: z.string().min(10, 'Посилання на трейлер не може бути порожнім'),
	ticketLink: z.string().min(10, 'Посилання на квитки не може бути порожнім'),
	showtimes: z.array(ShowtimeSchema).optional(),
	applications: z
		.array(z.any())
		.min(1, 'Поле застосунки не може бути порожнім'),
	poster: baseImageSchema.image,
	price: z.string().min(1, 'Ціна не може бути порожньою'),
});

export const MovieBaseSchema = z.object({
	id: z.string(),
	createdById: z.string(),
	createdBy: z.object({
		name: z.optional(z.string().nullable()),
	}),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const MovieSchema = MovieBaseSchema.merge(MovieFormSchema);

export const MoviesArraySchema = z.array(MovieSchema);

export const TCurrentMovies = MovieResponseSchema.merge(
	z.object({
		id: z.string(),
		createdBy: z.object({
			name: z.optional(z.string().nullable()),
		}),
	}),
);
