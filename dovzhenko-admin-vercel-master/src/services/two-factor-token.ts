import { db } from '@/lib/db';

/*
 * Get a two factor token by token
 * @param {string} token - The token to get
 * @returns {Object} - The two factor token
 *
 */
export const getTwoFactorTokenByToken = async (token: string) => {
	try {
		const twoFactorToken = await db.twoFactorToken.findUnique({
			where: {
				token,
			},
		});

		return twoFactorToken;
	} catch (error) {
		return null;
	}
};

/*
 * Create a two factor token
 * @param {string} email - The email to create the token
 * @param {string} token - The token to create
 * @returns {Object} - The two factor token
 *
 */
export const getTwoFactorTokenByEmail = async (email: string) => {
	try {
		const twoFactorToken = await db.twoFactorToken.findFirst({
			where: {
				email,
			},
		});

		return twoFactorToken;
	} catch (error) {
		return null;
	}
};
