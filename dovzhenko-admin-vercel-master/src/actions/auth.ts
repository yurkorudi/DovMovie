'use server';
import * as z from 'zod';
import {
	LoginSchema,
	NewPasswordSchema,
	RegisterSchema,
	ResetSchema,
} from '@/schemas';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getUserByEmail } from '@/services/user';
import { signIn, signOut } from '@/auth';
import { DEFAULT_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import {
	generatePasswordResetToken,
	generateTwoFactorToken,
	generateVerificationToken,
} from '@/lib/tokens';
import {
	sendPasswordResetEmail,
	sendTwoFactorTokenEmail,
	sendVerificationEmail,
} from '@/lib/mail';
import { getPasswordResetTokenByToken } from '@/services/password-reset';
import { getTwoFactorTokenByEmail } from '@/services/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '@/services/two-factor-confirmation';

export const logout = async () => {
	// Server stuff
	await signOut();
};

/*
 * Login function
 * @param {Object} values - The values to login
 * @param {string} values.email - The email to login
 * @param {string} values.password - The password to login
 * @returns {Object} - The result of the login
 *
 */
export const login = async (
	values: z.infer<typeof LoginSchema>,
	callbackUrl?: string,
) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}

	const { email, password, code } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.password || !existingUser.email) {
		return { error: 'Invalid credentials!', status: 401 };
	}

	if (existingUser && !existingUser.emailVerified) {
		return {
			error: 'Email not verified. Complete the registration!',
			status: 401,
		};
	}

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code) {
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

			if (!twoFactorToken) {
				return { error: 'Invalid code', status: 401 };
			}

			if (twoFactorToken.token !== code) {
				return { error: 'Invalid code!' };
			}

			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) {
				return { error: 'Code has expired', status: 401 };
			}

			await db.twoFactorToken.delete({
				where: {
					id: twoFactorToken.id,
				},
			});

			const existingConfirmation = await getTwoFactorConfirmationByUserId(
				existingUser.id,
			);

			if (existingConfirmation) {
				await db.twoFactorConfirmation.delete({
					where: {
						id: existingConfirmation.id,
					},
				});
			}

			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			});
		} else {
			// Send two factor token
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);
			await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

			return { twoFactor: true, status: 200 };
		}
	}

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: callbackUrl || DEFAULT_REDIRECT,
		});

		return { success: 'Successfully logged in!', status: 200 };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: 'Invalid credentials' };
				default:
					return { error: 'Something went wrong' };
			}
		}

		throw error;
	}
};

/*
    * Register
    * @param {Object} values - The values to register
    * @param {string} values.email - The email to register
    * @param {string} values.password - The password to register
    * @param {string} values.name - The name to register
    * @returns {Object} - The result of the registration
    *

 */
export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}

	const { email, password, name } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: 'User already exists' };
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await db.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
		},
	});

	// Send email verification
	const verificationToken = await generateVerificationToken(email);
	await sendVerificationEmail(email, verificationToken.token);

	return { message: 'Confirmation email has been sent!', success: true };
};

/*
 * Reset password
 * @param {Object} values - The values to reset the password
 * @param {string} values.email - The email to reset the password
 * @returns {Object} - The result of the reset
 */
export const reset = async (values: z.infer<typeof ResetSchema>) => {
	const validatedFields = ResetSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid email!' };
	}

	const { email } = validatedFields.data;
	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return { error: 'Email not found' };
	}

	// Send reset email
	const passwordResetToken = await generatePasswordResetToken(email);
	await sendPasswordResetEmail(
		passwordResetToken.email,
		passwordResetToken.token,
	);

	return { message: 'Reset email has been sent!', success: true };
};

export const newPassword = async (
	values: z.infer<typeof NewPasswordSchema>,
	token: string | null,
) => {
	if (!token) {
		return { error: 'Invalid token' };
	}

	const validatedFields = NewPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}

	const { password } = validatedFields.data;

	const existingToken = await getPasswordResetTokenByToken(token);

	if (!existingToken) {
		return { error: 'Invalid token' };
	}

	const hasExpired = new Date(existingToken.expires) > new Date();

	if (!hasExpired) {
		return { error: 'Token has expired!' };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: 'Email does not exist!' };
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await db.user.update({
		where: {
			id: existingUser.id,
		},
		data: {
			password: hashedPassword,
		},
	});

	await db.passwordResetToken.delete({
		where: {
			id: existingToken.id,
		},
	});

	return { message: 'Password has been updated!', success: true };
};
