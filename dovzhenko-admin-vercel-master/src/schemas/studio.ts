import { z } from 'zod';

export const StudioSchemaBase = {
	createdBy: z.optional(
		z.object({
			name: z.optional(z.string().nullable()), // Allow name to be string, null, or undefined
		}),
	),
	createdById: z.optional(z.string()),
	name: z.string().min(1, "Заголовок обов'язковий"),
	nameEng: z.string().min(1, "Заголовок обов'язковий"),
	description: z.string().min(3, "Опис обов'язковий"),
	descriptionEng: z.string().min(3, "Опис обов'язковий"),
	id: z.optional(z.string()),
	contactsName: z.string().min(3, "Ім'я керівника обов'язкове"),
	contactsNameEng: z.string().min(3, "Ім'я керівника обов'язкове"),
	contactsPhone: z
		.string()
		.min(
			10,
			"Контактний телефон обов'язковий і повинен містити мінімум 10 символів",
		),
	ageDiapason: z.string().min(3, "Віковий діапазон обов'язковий"),
	ageDiapasonEng: z.string().min(3, "Віковий діапазон обов'язковий"),
	scheduleDays: z.string().min(3, "Розклад обов'язковий"),
	scheduleDaysEng: z.string().min(3, "Розклад обов'язковий"),
	scheduleTime: z.string().min(3, "Час роботи обов'язковий"),
	scheduleTimeEng: z.string().min(3, "Час роботи обов'язковий"),
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

export const StudioSchema = z.object({
	...StudioSchemaBase,
	order: z.object(
		{
			value: z.string(),
			label: z.string(),
		},
		{
			required_error: 'Порядоковий номер обовязковий',
		},
	),
});

export const StudioSchemaDB = z.object({
	...StudioSchemaBase,
	order: z.string({
		required_error: 'Порядоковий номер обовязковий',
	}),
});

export const StudiosSchemaDB = z.array(StudioSchemaDB);
