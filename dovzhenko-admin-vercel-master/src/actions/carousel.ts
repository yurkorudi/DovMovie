'use server';

import { MainCarouselSlidesSchemaDB, SlideSchema } from '@/schemas/carousel';
import { z } from 'zod';
import { API_ROUTES } from '@/routes';
import { db } from '@/lib/db';
import { uploadFile } from '@/services/uploads';

export const handleCreateUpdateMainCarouselSlide = async (
	values: z.infer<typeof SlideSchema>,
	userId: string,
	editMode: boolean,
) => {
	const validatedFields = SlideSchema.safeParse(values);

	if (!validatedFields.success) {
		return { message: 'Форма не пройшла валідацію!', success: false };
	}

	const existingUser = await db.user.findUnique({
		where: { id: userId },
	});

	if (!existingUser) return { message: 'Unauthorized', success: false };

	const {
		startTime,
		dateForDisplay,
		dateForDisplayEng,
		title,
		titleEng,
		description,
		descriptionEng,
		link,
		linkTitle,
		linkTitleEng,
		typeImage,
		order,
		image,
	} = validatedFields.data;

	try {
		let responseUpload = null;

		if (image) {
			responseUpload = await uploadFile(
				image,
				API_ROUTES.UPLOAD,
				'main-carousel',
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
			const result = await db.mainCarousel.create({
				data: {
					startTime,
					dateForDisplay,
					dateForDisplayEng,
					title,
					titleEng,
					description,
					descriptionEng,
					link,
					linkTitle,
					linkTitleEng,
					typeImage,
					order: order.value,
					image: responseUpload.url,
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
		if (responseUpload && responseUpload.url.length && editMode) {
			const result = await db.mainCarousel.update({
				data: {
					startTime,
					dateForDisplay,
					dateForDisplayEng,
					title,
					titleEng,
					description,
					descriptionEng,
					link,
					linkTitle,
					linkTitleEng,
					typeImage,
					order: order.value,
					image: responseUpload.url,
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
			const result = await db.mainCarousel.update({
				data: {
					startTime,
					dateForDisplay,
					dateForDisplayEng,
					title,
					titleEng,
					description,
					descriptionEng,
					link,
					linkTitle,
					linkTitleEng,
					typeImage,
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

export const getMainCarouselSlides = async (): Promise<
	z.infer<typeof MainCarouselSlidesSchemaDB>
> => {
	const slides = await db.mainCarousel.findMany({
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

	return slides;
};

export const updateMainCarouselSlideOrder = async (
	slides: z.infer<typeof SlideSchema>[],
) => {
	try {
		await Promise.all(
			slides.map((slide, index) => {
				return db.mainCarousel.update({
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

export const deleteMainCarouselSlide = async (id: string) => {
	try {
		await db.mainCarousel.delete({
			where: {
				id,
			},
		});

		return { message: 'Слайд успішно видалено', success: true };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при видаленні слайду', success: false };
	}
};

export const deleteManyMainCarouselSlide = async (ids: string[]) => {
	try {
		await db.mainCarousel.deleteMany({
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
