'use server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { uploadFile } from '@/services/uploads';
import { API_ROUTES } from '@/routes';
import {
	StudioSchema,
	StudioSchemaDB,
	StudiosSchemaDB,
} from '@/schemas/studio';

export const getStudioById = async (
	id: string,
): Promise<z.infer<typeof StudioSchemaDB> | null> => {
	if (!id) return null;

	const studio = await db.studio.findUnique({
		where: {
			id,
		},
	});

	return studio;
};

export const getStudios = async (): Promise<
	z.infer<typeof StudiosSchemaDB>
> => {
	const studios = await db.studio.findMany({
		orderBy: {
			order: 'asc',
		},
		include: {
			createdBy: {
				select: {
					name: true,
				},
			},
		},
	});

	return studios;
};

export const deleteStudio = async (id: string) => {
	try {
		await db.studio.delete({
			where: {
				id,
			},
		});

		return { message: 'Студію успішно видалено', success: true };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при видаленні Студії', success: false };
	}
};

export const deleteManyStudios = async (ids: string[]) => {
	try {
		await db.studio.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});

		return { success: true, message: 'Слайд(и) успішно видалено' };
	} catch (error) {
		console.log(error);

		return { success: false, message: 'Помилка при видаленні слайд(у)' };
	}
};

export const updateStudiosOrder = async (
	studios: z.infer<typeof StudioSchema>[],
) => {
	try {
		await Promise.all(
			studios.map((studio, index) => {
				return db.studio.update({
					data: {
						order: String(index),
					},
					where: {
						id: studio.id,
					},
				});
			}),
		);

		return { message: 'Порядок студій успішно оновлено', success: true };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при оновленні порядку студій', success: false };
	}
};

export const handleCreateUpdateStudio = async (
	values: z.infer<typeof StudioSchema>,
	userId: string,
	editMode: boolean,
) => {
	const validatedFields = StudioSchema.safeParse(values);

	if (!validatedFields.success) {
		return { message: 'Форма не пройшла валідацію!', success: false };
	}

	const existingUser = await db.user.findUnique({
		where: { id: userId },
	});

	if (!existingUser) return { message: 'Unauthorized', success: false };

	const {
		name,
		nameEng,
		description,
		descriptionEng,
		contactsName,
		contactsNameEng,
		contactsPhone,
		ageDiapason,
		ageDiapasonEng,
		scheduleDays,
		scheduleDaysEng,
		scheduleTime,
		scheduleTimeEng,
		order,
		image,
	} = validatedFields.data;

	try {
		let responseUpload = null;

		if (image) {
			responseUpload = await uploadFile(image, API_ROUTES.UPLOAD, 'studios');

			if (responseUpload?.errors?.length) {
				return {
					success: false,
					message: 'Помилка при завантаженні файла',
				};
			}
		}

		// Create studio
		if (responseUpload && responseUpload.url.length && !editMode) {
			const result = await db.studio.create({
				data: {
					name,
					nameEng,
					description,
					descriptionEng,
					contactsName,
					contactsNameEng,
					contactsPhone,
					ageDiapason,
					ageDiapasonEng,
					scheduleDays,
					scheduleDaysEng,
					scheduleTime,
					scheduleTimeEng,
					order: order.value,
					image: responseUpload.url,
					createdBy: {
						connect: { id: existingUser.id },
					},
				},
			});

			return {
				message: 'Студію успішно додано',
				success: true,
				result,
			};
		}

		// Edit studio with new image
		if (responseUpload && responseUpload.url.length && editMode) {
			const result = await db.studio.update({
				data: {
					name,
					nameEng,
					description,
					descriptionEng,
					contactsName,
					contactsNameEng,
					contactsPhone,
					ageDiapason,
					ageDiapasonEng,
					scheduleDays,
					scheduleDaysEng,
					scheduleTime,
					scheduleTimeEng,
					order: order.value,
					image: responseUpload.url,
				},
				where: {
					id: values.id,
				},
			});

			return {
				message: 'Студію успішно оновлено',
				success: true,
				result,
			};
		}

		// Edit studio without new image
		if (!responseUpload && editMode) {
			const result = await db.studio.update({
				data: {
					name,
					nameEng,
					description,
					descriptionEng,
					contactsName,
					contactsNameEng,
					contactsPhone,
					ageDiapason,
					ageDiapasonEng,
					scheduleDays,
					scheduleDaysEng,
					scheduleTime,
					scheduleTimeEng,
					order: order.value,
				},
				where: {
					id: values.id,
				},
			});

			return {
				message: 'Студію успішно оновлено',
				success: true,
				result,
			};
		}

		return { message: 'Щось пішло не так...', success: false };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при створенні Студії', success: false };
	}
};
