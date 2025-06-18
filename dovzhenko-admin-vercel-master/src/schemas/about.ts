import { z } from 'zod';
import { baseImageSchema } from '@/schemas/base';

export const AboutSchemaBase = {
	createdBy: z.optional(
		z.object({
			name: z.optional(z.string().nullable()), // Allow name to be string, null, or undefined
		}),
	),
	createdById: z.optional(z.string()),
	name: z.string().min(1, "Ім'я обов'язкове"),
	nameEng: z.string().min(1, "Ім'я обов'язкове"),
	surname: z.string().min(3, "Прізвище обов'язкове"),
	surnameEng: z.string().min(3, "Прізвище обов'язкове"),
	position: z.string().min(3, "Посада обов'язкова"),
	positionEng: z.string().min(3, "Посада обов'язкова"),
	id: z.optional(z.string()),
	...baseImageSchema,
	secondImage: baseImageSchema.image,
};

export const AboutSchema = z.object({
	...AboutSchemaBase,
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

export const AboutSchemaDB = z.object({
	...AboutSchemaBase,
	order: z.string({
		required_error: 'Порядоковий номер обовязковий',
	}),
});

export const AboutUsSchemaDB = z.array(AboutSchemaDB);
