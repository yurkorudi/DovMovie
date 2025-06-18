import { db } from '@/lib/db';

/*
 * Generate password reset token
 * @param {string} email - The email to generate the token
 * @returns {Object} - The result of the token generation
 *
 */
export const getPasswordResetTokenByToken = async (token: string) => {
	try {
		const passwordResetToken = await db.passwordResetToken.findFirst({
			where: {
				token,
			},
		});

		return passwordResetToken;
	} catch (error) {
		console.error(error);

		return null;
	}
};
