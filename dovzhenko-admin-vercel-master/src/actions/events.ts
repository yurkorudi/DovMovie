'use server';

import { db } from '@/lib/db';
import { z } from 'zod';
import { EventSchemaDB, MainEventSchemaDB } from '@/schemas/event';
import { uploadFile } from '@/services/uploads';
import { API_ROUTES } from '@/routes';

export const getAllEvents = async (): Promise<
	z.infer<typeof MainEventSchemaDB>
> => {
	const events = await db.event.findMany({
		include: {
			createdBy: {
				select: {
					name: true,
				},
			},
		},
	});

	return events;
};

export const getEventById = async (
	id: string,
): Promise<z.infer<typeof EventSchemaDB> | null> => {
	if (!id) return null;

	const event = await db.event.findUnique({
		where: {
			id,
		},
	});

	return event ?? null;
};

export const deleteEventAction = async (id: string) => {
	try {
		await db.event.delete({
			where: {
				id,
			},
		});

		return { message: 'Подію успішно видалено', success: true };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при видаленні події', success: false };
	}
};

export const deleteManyEventsAction = async (ids: string[]) => {
	try {
		await db.event.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});

		return { success: true, message: 'Події успішно видалено' };
	} catch (error) {
		console.log(error);

		return { success: false, message: 'Помилка при видаленні подій' };
	}
};

export const handleCreateUpdateEvent = async (
	values: z.infer<typeof EventSchemaDB>,
	userId: string,
	editMode: boolean,
) => {
	const validatedFields = EventSchemaDB.safeParse(values);
	const existingUser = await db.user.findUnique({
		where: { id: userId },
	});

	if (!existingUser) return { message: 'Unauthorized', success: false };

	if (!validatedFields.success) {
		return { message: 'Форма не пройшла валідацію!', success: false };
	}

	const {
		title,
		titleEng,
		cardDescription,
		cardDescriptionEng,
		startTime,
		startDateString,
		startDateStringEng,
		link,
		typeImage,
		backgroundImage,
		freeEntry,
	} = validatedFields.data;

	try {
		let responseUpload = null;

		if (backgroundImage) {
			responseUpload = await uploadFile(
				backgroundImage,
				API_ROUTES.UPLOAD,
				'events',
			);

			if (responseUpload?.errors?.length) {
				return {
					success: false,
					message: 'Помилка при завантаженні файла',
				};
			}
		}

		// Create slide
		if (responseUpload && responseUpload.url.length && !editMode) {
			const result = await db.event.create({
				data: {
					title,
					titleEng,
					cardDescription,
					cardDescriptionEng,
					startTime,
					startDateString,
					startDateStringEng,
					link,
					typeImage,
					freeEntry,
					backgroundImage: responseUpload.url,
					createdBy: {
						connect: { id: existingUser.id },
					},
				},
			});

			return {
				message: 'Подію успішно додано',
				success: true,
				result,
			};
		}

		// Edit slide with new image
		if (responseUpload && responseUpload.url.length && editMode) {
			const result = await db.event.update({
				data: {
					title,
					titleEng,
					cardDescription,
					cardDescriptionEng,
					startTime,
					startDateString,
					startDateStringEng,
					link,
					typeImage,
					freeEntry,
					backgroundImage: responseUpload.url,
				},
				where: {
					id: values.id,
				},
			});

			return {
				message: 'Подія успішно оновлена',
				success: true,
				result,
			};
		}

		// Edit slide without new image
		if (!responseUpload && editMode) {
			const result = await db.event.update({
				data: {
					title,
					titleEng,
					cardDescription,
					cardDescriptionEng,
					startTime,
					startDateString,
					startDateStringEng,
					link,
					typeImage,
					freeEntry,
				},
				where: {
					id: values.id,
				},
			});

			return {
				message: 'Подія успішно оновлена',
				success: true,
				result,
			};
		}

		return { message: 'Щось пішло не так...', success: false };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при створенні події', success: false };
	}
};
