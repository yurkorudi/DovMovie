import { db } from '@/lib/db';

/*
 * Get a verification token by email.
 *
 * @param email - The email to search for.
 * @returns The verification token.
 * @type {string} - The email to search for.
 */
export const getVerificationTokenByEmail = async (email: string) => {
	try {
		const verificationToken = await db.verificationToken.findFirst({
			where: { email },
		});

		return verificationToken;
	} catch (e) {
		console.log('Error getting verification token: ', e);

		return null;
	}
};

/*
 * Get a verification token by token.
 *
 * @param token - The token to search for.
 * @returns The verification token.
 * @type {string} - The token to search for.
 */
export const getVerificationTokenByToken = async (token: string) => {
	try {
		const verificationToken = await db.verificationToken.findUnique({
			where: { token },
		});

		return verificationToken;
	} catch (e) {
		console.log('Error getting verification token: ', e);

		return null;
	}
};
