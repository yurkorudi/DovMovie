import * as z from 'zod';
import { EventType } from '@prisma/client';

/*
 * SlideSchema is a schema for validating the structure of a single slide object.
 * It is used to validate the data of a slide object before saving it to the database.
 */
export const SlideSchemaBase = {
	createdBy: z.optional(
		z.object({
			name: z.optional(z.string().nullable()), // Allow name to be string, null, or undefined
		}),
	),
	createdById: z.optional(z.string()),
	id: z.optional(z.string()),
	startTime: z.date({
		required_error: "Дата події обов'язкова",
	}),
	// .transform(({ value }) => value),
	dateForDisplay: z.string().min(1, 'Дата обовязкова'),
	dateForDisplayEng: z.string().min(1, 'Дата обовязкова'),
	title: z.string().min(1, "Заголовок обов'язковий"),
	titleEng: z.string().min(1, "Заголовок обов'язковий"),
	description: z.string().min(1, 'Опис обовязковий'),
	descriptionEng: z.string().min(1, 'Опис обовязковий'),
	link: z.optional(z.string().nullable()),
	linkTitle: z.optional(z.string().nullable()),
	linkTitleEng: z.optional(z.string().nullable()),
	typeImage: z.nativeEnum(EventType),
	image: z
		.any()
		.transform((val) => (val ? val : null))
		.refine((value) => {
			if (!value) return true;

			// Validation for image data if provided as base64 encoded string
			if (typeof value === 'string' && value.startsWith('data:image/')) {
				// Extracting the base64 part of the image data
				const base64Data = value.split(',')[1];
				// Calculating the size of the base64 data in bytes
				const fileSizeInBytes = (base64Data.length * 3) / 4 - 2;

				// Checking if the file size exceeds 5 MB
				const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB in bytes

				if (fileSizeInBytes > maxSizeInBytes) {
					return false; // Validation fails if the file size exceeds the maximum
				}
			}

			// If it's not base64 encoded or within size limits, consider it valid
			return true;
		}, 'Максимальний розмір файлу 5 МБ'),
};

export const SlideSchema = z.object({
	...SlideSchemaBase,
	order: z.object(
		{
			value: z.string(),
			label: z.string(),
		},
		{
			required_error: 'Порядковий номер обовязковий',
		},
	),
});

export const SlideSchemaDB = z.object({
	...SlideSchemaBase,
	order: z.string(),
});

export const MainCarouselSlidesSchemaDB = z.array(SlideSchemaDB);
