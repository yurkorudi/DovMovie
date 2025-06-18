'use server';
import { z } from 'zod';
import { AboutSchema, AboutSchemaDB, AboutUsSchemaDB } from '@/schemas/about';
import { db } from '@/lib/db';
import { uploadFile } from '@/services/uploads';
import { API_ROUTES } from '@/routes';

export const getAllAboutUsSlides = async (): Promise<
	z.infer<typeof AboutUsSchemaDB>
> => {
	const aboutSlides = await db.about.findMany({
		include: {
			createdBy: {
				select: {
					name: true,
				},
			},
		},
	});

	return aboutSlides;
};

export const getAboutSlideById = async (
	id: string,
): Promise<z.infer<typeof AboutSchemaDB> | null> => {
	if (!id) return null;

	const event = await db.about.findUnique({
		where: {
			id,
		},
	});

	return event ?? null;
};

export const deleteAboutSlideAction = async (id: string) => {
	try {
		await db.about.delete({
			where: {
				id,
			},
		});

		return { message: 'Слайд успішно видалено', success: true };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при видаленні Слайду', success: false };
	}
};

export const deleteManyAboutSlidesAction = async (ids: string[]) => {
	try {
		await db.about.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});

		return { success: true, message: 'Слайди успішно видалено' };
	} catch (error) {
		console.log(error);

		return { success: false, message: 'Помилка при видаленні слайдів' };
	}
};

export const handleCreateUpdateAboutSlide = async (
	values: z.infer<typeof AboutSchema>,
	userId: string,
	editMode: boolean,
) => {
	const validatedFields = AboutSchema.safeParse(values);

	const existingUser = await db.user.findUnique({
		where: { id: userId },
	});

	if (!existingUser) return { message: 'Unauthorized', success: false };

	if (!validatedFields.success) {
		return { message: 'Форма не пройшла валідацію!', success: false };
	}

	const {
		name,
		nameEng,
		surname,
		surnameEng,
		position,
		positionEng,
		order,
		image,
		secondImage,
	} = validatedFields.data;

	try {
		let responseUpload = null;
		let responseUploadSecond = null;

		if (image) {
			responseUpload = await uploadFile(image, API_ROUTES.UPLOAD, 'about-us');
			responseUploadSecond = await uploadFile(
				secondImage,
				API_ROUTES.UPLOAD,
				'about-us',
			);

			if (!responseUpload?.url.length && !responseUploadSecond.url.length) {
				return {
					success: false,
					message: 'Помилка при завантаженні файлів',
				};
			}
		}

		// Create slide
		if (
			responseUpload &&
			responseUpload.url.length &&
			responseUploadSecond &&
			responseUploadSecond.url.length &&
			!editMode
		) {
			const result = await db.about.create({
				data: {
					name,
					nameEng,
					surname,
					surnameEng,
					position,
					positionEng,
					order: order.value,
					image: responseUpload.url,
					secondImage: responseUploadSecond.url,
					createdBy: {
						connect: { id: existingUser.id },
					},
				},
			});

			return {
				message: 'Слайд успішно додано',
				success: true,
				result,
			};
		}

		// Edit slide with new image
		if (
			responseUpload &&
			responseUpload.url.length &&
			responseUploadSecond &&
			responseUploadSecond.url.length &&
			editMode
		) {
			const result = await db.about.update({
				data: {
					name,
					nameEng,
					surname,
					surnameEng,
					position,
					positionEng,
					order: order.value,
					image: responseUpload.url,
					secondImage: responseUploadSecond.url,
				},
				where: {
					id: values.id,
				},
			});

			return {
				message: 'Слайд успішно оновлено',
				success: true,
				result,
			};
		}

		// Edit slide without new image
		if (!responseUpload && editMode) {
			const result = await db.about.update({
				data: {
					name,
					nameEng,
					surname,
					surnameEng,
					position,
					positionEng,
					order: order.value,
				},
				where: {
					id: values.id,
				},
			});

			return {
				message: 'Слайд успішно оновлено',
				success: true,
				result,
			};
		}

		return { message: 'Щось пішло не так...', success: false };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при створенні слайду', success: false };
	}
};

export const updateAboutUsSlideOrder = async (
	slides: z.infer<typeof AboutSchema>[],
) => {
	try {
		await Promise.all(
			slides.map((slide, index) => {
				return db.about.update({
					data: {
						order: String(index),
					},
					where: {
						id: slide.id,
					},
				});
			}),
		);

		return { message: 'Порядок слайдів успішно оновлено', success: true };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при оновленні порядку слайдів', success: false };
	}
};
