import { nanoid } from 'nanoid';
import { getVerificationTokenByEmail } from '@/services/verification-token';
import { db } from '@/lib/db';
import { getPasswordResetTokenByToken } from '@/services/password-reset';
import crypto from 'crypto';
import { getTwoFactorTokenByToken } from '@/services/two-factor-token';

/*
 * Generate a verification token.
 *
 * @param email - The email to generate a token for.
 * @returns The verification token.
 * @type {string} - The email to generate a token for.
 */
export const generateVerificationToken = async (email: string) => {
	const token = nanoid(64);
	const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		await db.verificationToken.delete({
			where: { id: existingToken.id },
		});
	}

	const verificationToken = await db.verificationToken.create({
		data: { email, token, expires },
	});

	return verificationToken;
};

/*
 * Generate a password reset token.
 * @param email - The email to generate a token for.
 * @type {string} - The email to generate a token for.
 * @returns The password reset token.
 */
export const generatePasswordResetToken = async (email: string) => {
	const token = nanoid(64);
	const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

	const existingToken = await getPasswordResetTokenByToken(token);

	if (existingToken) {
		await db.passwordResetToken.delete({
			where: { id: existingToken.id },
		});
	}

	const passwordResetToken = await db.passwordResetToken.create({
		data: { token, expires, email },
	});

	return passwordResetToken;
};

export const generateTwoFactorToken = async (email: string) => {
	const token = crypto.randomInt(100_000, 999_999).toString();
	const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

	const existingToken = await getTwoFactorTokenByToken(token);

	if (existingToken) {
		await db.twoFactorToken.delete({
			where: { id: existingToken.id },
		});
	}

	const twoFactorToken = await db.twoFactorToken.create({
		data: { token, expires, email },
	});

	return twoFactorToken;
};
