import { z } from 'zod';
import { EventType } from '@prisma/client';

export const EventSchemaDB = z.object({
	createdBy: z.optional(
		z.object({
			name: z.optional(z.string().nullable()), // Allow name to be string, null, or undefined
		}),
	),
	createdById: z.optional(z.string()),
	freeEntry: z.optional(z.boolean()),
	title: z.string().min(1, "Заголовок обов'язковий"),
	titleEng: z.string().min(1, "Заголовок обов'язковий"),
	cardDescription: z.string().min(3, "Опис обов'язковий"),
	cardDescriptionEng: z.string().min(3, "Опис обов'язковий"),
	id: z.optional(z.string()),
	startTime: z.date({
		required_error: "Дата події обов'язкова",
	}),
	startDateString: z.string({
		required_error: 'Дата події обов`язкова',
	}),
	startDateStringEng: z.string({
		required_error: 'Дата події обов`язкова',
	}),
	link: z.string({
		required_error: 'Посилання на подію обов`язкове',
	}),
	typeImage: z.nativeEnum(EventType),
	backgroundImage: z
		.any()
		.transform((val) => (val ? val : null))
		.refine((value) => {
			// Custom validation function to validate image if uploaded
			if (!value) return true;

			// Validation for image data if provided as base64 encoded string
			if (typeof value === 'string' && value.startsWith('data:image/')) {
				// Extracting the base64 part of the image data
				const base64Data = value.split(',')[1];
				// Calculating the size of the base64 data in bytes
				const fileSizeInBytes = (base64Data.length * 3) / 4 - 2;

				// Checking if the file size exceeds 50 MB
				const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB in bytes

				if (fileSizeInBytes > maxSizeInBytes) {
					return false; // Validation fails if the file size exceeds the maximum
				}
			}

			// If it's not base64 encoded or within size limits, consider it valid
			return true;
		}, 'Максимальний розмір файлу 10 МБ'),
});

export const MainEventSchemaDB = z.array(EventSchemaDB);
