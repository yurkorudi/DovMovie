'use server';
import { db } from '@/lib/db';
import { UserSchema, UserSchemaDB } from '@/schemas/user';
import { z } from 'zod';
import { getUserByEmail, getUserById } from '@/services/user';
import bcrypt from 'bcryptjs';

/*
 * This function is used to interact with the user table in the database.
 *
 * This function is used for admin purposes.
 *
 * It is used to get all users in the database.
 */
export const getAllUsers = async (): Promise<
	z.infer<typeof UserSchemaDB>[] | null
> => {
	const users = await db.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			emailVerified: true,
			image: true,
			isTwoFactorEnabled: true,
		},
		orderBy: {
			name: 'asc',
		},
	});

	return users;
};

export const createUser = async (values: z.infer<typeof UserSchema>) => {
	const validatedFields = UserSchema.safeParse(values);

	if (!validatedFields.success) {
		return { message: 'Форма не пройшла валідацію!', success: false };
	}

	const { email, password, name } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { message: 'Користувач з таким емейлом вже існує' };
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await db.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				isTwoFactorEnabled: false,
				emailVerified: new Date(),
			},
		});

		return { message: 'Користувач успішно створений', success: true };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при створенні користувача', success: false };
	}
};

export const deleteUser = async (id: string) => {
	try {
		await db.user.delete({
			where: {
				id,
			},
		});

		return { message: 'Користувач успішно видалений', success: true };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при видаленні користувача', success: false };
	}
};

export const updateUser = async (
	values: z.infer<typeof UserSchema>,
	id: string,
) => {
	const validatedFields = UserSchema.safeParse(values);

	if (!validatedFields.success) {
		return { message: 'Форма не пройшла валідацію!', success: false };
	}

	const { password, name, email } = validatedFields.data;

	const existingUser = await getUserById(id);

	if (!existingUser) {
		return { message: 'Такого користувача не існує' };
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await db.user.update({
			data: {
				password: hashedPassword,
				name,
				email,
			},
			where: {
				id,
			},
		});

		return { message: 'Користувача успішно оновлено', success: true };
	} catch (error) {
		console.log(error);

		return { message: 'Помилка при оновлені користувача', success: false };
	}
};
