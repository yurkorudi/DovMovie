import type { NextAuthConfig } from 'next-auth';
import Credentials from '@auth/core/providers/credentials';
import { getUserByEmail } from '@/services/user';
import { LoginSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import GitHub from '@auth/core/providers/github';
import Google from 'next-auth/providers/google';

export default {
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
			clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
		}),
		GitHub({
			clientId: process.env.AUTH_GITHUB_ID,
			clientSecret: process.env.AUTH_GITHUB_SECRET,
		}),
		Credentials({
			authorize: async (credentials) => {
				const validatedFields = LoginSchema.safeParse(credentials);

				if (!validatedFields.success) return null;

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;
					const user = await getUserByEmail(email);

					if (!user || !user.password) {
						return null;
					}

					const passwordsMatch = await bcrypt.compare(password, user.password);

					if (passwordsMatch) {
						return user;
					}
				}

				return null;
			},
		}),
	],
} satisfies NextAuthConfig;
