'use server';

import { getVerificationTokenByToken } from '@/services/verification-token';
import { getUserByEmail } from '@/services/user';
import { db } from '@/lib/db';

/*
 * Verifies token and marks the user's email as verified if the token is valid and has not expired.
 *
 * @param {string} token - The token to verify the email.
 * @returns {Promise<{error: string, status: number}|{status: number, message: string}>} - The result of the token verification.
 */
export const verificationEmail = async (token: string) => {
	const existingToken = await getVerificationTokenByToken(token);

	if (!existingToken) {
		return { error: 'Invalid token', status: 400 };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return { error: 'Token has expired', status: 400 };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: 'User not found', status: 400 };
	}

	await db.user.update({
		where: { id: existingUser.id },
		data: { emailVerified: new Date(), email: existingToken.email },
	});

	await db.verificationToken.delete({ where: { id: existingToken.id } });

	return { success: true, message: 'Email verified!' };
};
