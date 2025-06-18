'use server';

import { z } from 'zod';
import {
	MovieFormSchema,
	MovieResponseSchema,
	TCurrentMovies,
} from '@/schemas/movie';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { uploadFile } from '@/services/uploads';
import { API_ROUTES } from '@/routes';
import { DateListType, EStorageFolders } from '@/lib/types/common';
import moment from 'moment';

export const deleteMovie = async (id: string) => {
	const user = await currentUser();

	if (!user) {
		return { message: 'Не авторизовано', success: false };
	}

	if (!id) {
		return { message: 'Не вказано ID фільму', success: false };
	}

	const existingUser = await db.user.findUnique({
		where: { id: user.id },
	});

	if (!existingUser) return { message: 'Не авторизовано', success: false };

	try {
		await db.showtime.deleteMany({
			where: { movieId: id },
		});
		await db.movie.delete({
			where: { id },
		});

		return { message: 'Фільм успішно видалено', success: true };
	} catch (e) {
		console.log(e);

		return { message: 'Помилка при видаленні фільму', success: false };
	}
};

export const getCurrentMovies = async (): Promise<
	z.infer<typeof TCurrentMovies>[]
> => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const nextWednesday = new Date(today);
	const daysUntilWednesday = (3 - today.getDay() + 7) % 7; // Calculate days until next Wednesday
	nextWednesday.setDate(today.getDate() + daysUntilWednesday);
	nextWednesday.setHours(23, 59, 59, 999);

	const movies = await db.movie.findMany({
		where: {
			showtimes: {
				some: {
					dateTime: {
						gte: today, // Ensure at least one showtime is today or later
						lte: nextWednesday, // Ensure the showtime is before the end of next Wednesday
					},
				},
			},
		},
		include: {
			createdBy: {
				select: {
					name: true,
				},
			},
			showtimes: true,
		},
	});

	return movies;
};

export const getArchiveMovies = async (): Promise<
	z.infer<typeof MovieResponseSchema>[]
> => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const movies = await db.movie.findMany({
		where: {
			showtimes: {
				some: {
					dateTime: {
						lt: today,
					},
				},
			},
		},
		include: {
			createdBy: {
				select: {
					name: true,
				},
			},
			showtimes: {
				where: {
					dateTime: {
						lt: today,
					},
				},
			},
		},
	});

	return movies;
};

export const getMovieById = async (id: string) => {
	if (!id) return null;
	const movie = await db.movie.findUnique({
		where: { id },
		include: { showtimes: true },
	});

	return movie;
};

export const editSaveMovie = async (
	values: z.infer<typeof MovieFormSchema>,
	posterFormData: FormData,
	showtime: DateListType[],
	movieId: string,
) => {
	const user = await currentUser();

	if (!user) {
		return { message: 'Не авторизовано', success: false };
	}

	const validatedFields = MovieFormSchema.safeParse(values);

	const existingUser = await db.user.findUnique({
		where: { id: user.id },
	});

	if (!existingUser) return { message: 'Не авторизовано', success: false };

	if (!validatedFields.success) {
		return { message: 'Форма не пройшла валідацію!', success: false };
	}

	if (!showtime.length) {
		return { message: 'Виберіть хоча б один сеанс!', success: false };
	}

	const {
		title,
		titleEng,
		description,
		descriptionEng,
		age,
		genre,
		genreEng,
		filmMaker,
		filmMakerEng,
		country,
		countryEng,
		duration,
		trailerLink,
		ticketLink,
		applications,
		price,
		poster,
	} = validatedFields.data;

	if (!posterFormData.get('files') && !poster.length) {
		return { message: 'Виберіть постер!', success: false };
	}

	try {
		let responseUpload = null;

		if (posterFormData.get('files')) {
			responseUpload = await uploadFile(
				posterFormData,
				API_ROUTES.UPLOAD,
				EStorageFolders.MOVIES,
			);

			if (responseUpload?.errors?.length) {
				return {
					success: false,
					message: 'Помилка при завантаженні файла',
				};
			}
		}

		await db.movie.update({
			where: { id: movieId },
			data: {
				title,
				titleEng,
				description,
				descriptionEng,
				age,
				genre,
				genreEng,
				filmMaker,
				filmMakerEng,
				country,
				countryEng,
				duration,
				trailerLink,
				ticketLink,
				price,
				applications: JSON.stringify(applications),
				poster:
					responseUpload && responseUpload?.url?.length
						? responseUpload.url
						: poster,
			},
		});

		await db.showtime.deleteMany({
			where: { movieId: movieId },
		});

		for (const item of showtime) {
			for (const time of item.time) {
				const dateTime = moment
					.tz(`${item.date.toISOString().split('T')[0]}T${time}`, 'Europe/Kyiv')
					.utc();

				await db.showtime.create({
					data: {
						dateTime: dateTime.toDate(), // Сохраняем в формате UTC
						movie: {
							connect: { id: movieId },
						},
					},
				});
			}
		}

		return { message: 'Фільм успішно відредаговано', success: true };
	} catch (e) {
		console.log(e);

		return { message: 'Помилка при редагуванні фільму', success: false };
	}
};

export const createMovie = async (
	values: z.infer<typeof MovieFormSchema>,
	poster: FormData,
	showtime: DateListType[],
) => {
	const user = await currentUser();

	if (!user?.id) {
		return {
			message: 'Не авторизовано',
			success: false,
			redirect: true,
		};
	}

	const validatedFields = MovieFormSchema.safeParse(values);

	const existingUser = await db.user.findUnique({
		where: { id: user.id },
	});

	if (!existingUser) return { message: 'Не авторизовано', success: false };

	if (!validatedFields.success) {
		return { message: 'Форма не пройшла валідацію!', success: false };
	}

	if (!poster.get('files')) {
		return { message: 'Виберіть постер!', success: false };
	}

	if (!showtime.length) {
		return { message: 'Виберіть хоча б один сеанс!', success: false };
	}

	const {
		title,
		titleEng,
		description,
		descriptionEng,
		age,
		genre,
		genreEng,
		filmMaker,
		filmMakerEng,
		country,
		countryEng,
		duration,
		trailerLink,
		ticketLink,
		applications,
		price,
	} = validatedFields.data;

	try {
		let responseUpload = null;

		if (poster) {
			responseUpload = await uploadFile(
				poster,
				API_ROUTES.UPLOAD,
				EStorageFolders.MOVIES,
			);

			if (responseUpload?.errors?.length) {
				return {
					success: false,
					message: 'Помилка при завантаженні файла',
				};
			}
		}

		if (responseUpload && responseUpload.url.length) {
			const movie = await db.movie.create({
				data: {
					title,
					titleEng,
					description,
					descriptionEng,
					age,
					genre,
					genreEng,
					filmMaker,
					filmMakerEng,
					country,
					countryEng,
					duration,
					trailerLink,
					ticketLink,
					price,
					applications: JSON.stringify(applications),
					poster: responseUpload.url,
					createdBy: {
						connect: { id: existingUser.id },
					},
				},
			});

			for (const item of showtime) {
				for (const time of item.time) {
					const dateTime = moment
						.tz(
							`${item.date.toISOString().split('T')[0]}T${time}`,
							'Europe/Kyiv',
						)
						.utc();

					await db.showtime.create({
						data: {
							dateTime: dateTime.toDate(),
							movie: {
								connect: { id: movie.id },
							},
						},
					});
				}
			}
		}

		return { message: 'Фільм успішно створено', success: true };
	} catch (e) {
		console.log(e);

		return { message: 'Помилка при створенні фільму', success: false };
	}
};
