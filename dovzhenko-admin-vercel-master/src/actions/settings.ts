'use server';

import { CredentialsSchema, SettingsSchema } from '@/schemas';
import { currentUser } from '@/lib/auth';
import { z } from 'zod';
import { getUserByEmail, getUserById } from '@/services/user';
import { db } from '@/lib/db';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import bcrypt from 'bcryptjs';

export const updateCredentials = async (
	values: z.infer<typeof CredentialsSchema>,
) => {
	const user = await currentUser();

	if (!user) return { error: 'Unauthorized' };

	const dbUser = await getUserById(user.id!);

	if (!dbUser) return { error: 'Unauthorized' };

	if (user.isOAuth) {
		values.password = undefined;
		values.newPassword = undefined;
	}

	if (values.password && values.newPassword && dbUser.password) {
		const passwordMatch = await bcrypt.compare(
			values.password,
			dbUser.password,
		);
		if (!passwordMatch) return { error: 'Current password is incorrect' };

		const hashedPassword = await bcrypt.hash(values.newPassword, 10);
		values.password = hashedPassword;
		values.newPassword = undefined;
	}

	await db.user.update({
		where: { id: dbUser.id },
		data: values,
	});
};

export const updateSettings = async (
	values: z.infer<typeof SettingsSchema>,
) => {
	const user = await currentUser();

	if (!user) return { error: 'Unauthorized' };

	const dbUser = await getUserById(user.id!);

	if (!dbUser) return { error: 'Unauthorized' };

	if (user.isOAuth) {
		values.email = undefined;
		values.isTwoFactorEnabled = undefined;
	}

	if (values.email && values.email !== user.email) {
		const existingUser = await getUserByEmail(values.email);

		if (existingUser && existingUser.id !== user.id) {
			return { error: 'Email already in use' };
		}

		const verificationToken = await generateVerificationToken(values.email);
		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token,
		);

		return {
			success:
				'Email updated, please check your inbox to verify your new email!',
		};
	}

	await db.user.update({
		where: { id: dbUser.id },
		data: values,
	});

	return { success: 'Settings updated' };
};
