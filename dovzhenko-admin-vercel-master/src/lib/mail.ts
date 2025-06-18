import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_API_URL;

/**
 * Send a verification email.
 *
 * This function sends a verification email to the user's email address.
 * @param {string} email
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/email-verification?token=${token}`;

	try {
		await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: email,
			subject: 'Verify your email',
			html: `
                <h1>Verify your email</h1>
                <p>Click the link below to verify your email address</p>
                <a href="${confirmLink}">Verify email</a>
            `,
		});
	} catch (e) {
		console.log('Error sending verification email: ', e);
	}
};

/*
 * Send a password reset email.
 * @param {string} email - The email to send the password reset email to
 * @param {string} token - The token to send in the password reset email
 * @returns {Promise<void>}
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${domain}/auth/new-password?token=${token}`;

	try {
		await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: email,
			subject: 'Reset your password',
			html: `
                <h1>Reset your password</h1>
                <p>Click the link below to reset your password</p>
                <a href="${resetLink}">Reset password</a>  
            `,
		});
	} catch (e) {
		console.log('Error sending password reset email: ', e);
	}
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	try {
		await resend.emails.send({
			from: 'onboarding@resend.dev',
			to: email,
			subject: 'Your two factor token',
			html: `
                <h1>Your two factor token</h1>
                <p>Your two factor token is: ${token}</p>
            `,
		});
	} catch (e) {
		console.log('Error sending two factor token email: ', e);
	}
};
