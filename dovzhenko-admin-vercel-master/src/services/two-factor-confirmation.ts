import { db } from '@/lib/db';

/*
 * Get a two factor confirmation by user id
 * @param {string} userId - The user id to get the two factor confirmation
 * @returns {Object} - The two factor confirmation
 *
 */
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
	try {
		const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
			where: {
				userId,
			},
		});

		return twoFactorConfirmation;
	} catch (error) {
		return null;
	}
};
