import { z } from 'zod';

export const UserSchema = z.object({
	name: z.string().min(3, "Ім'я обов'язкове"),
	email: z.string().email('Невірний формат email'),
	password: z.string().min(6, 'Пароль повинен бути не менше 6 символів'),
});

export const UserSchemaDB = z.object({
	id: z.string(),
	name: z.string().nullable(),
	email: z.string().nullable(),
	emailVerified: z.date().nullable(),
	image: z.string().nullable(),
	isTwoFactorEnabled: z.boolean(),
});
