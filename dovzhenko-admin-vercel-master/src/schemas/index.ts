import * as z from 'zod';
import { UserRole } from '.prisma/client';

export const CredentialsSchema = z
	.object({
		password: z.optional(z.string().min(6)),
		newPassword: z.optional(z.string().min(6)),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false;
			}

			return true;
		},
		{
			message: 'New password is required!',
			path: ['newPassword'],
		},
	)
	.refine(
		(data) => {
			if (data.newPassword && !data.password) {
				return false;
			}

			return true;
		},
		{
			message: 'Password is required!',
			path: ['password'],
		},
	);

// TODO: rescrict image formats
export const SettingsSchema = z.object({
	name: z.optional(z.string()),
	isTwoFactorEnabled: z.optional(z.boolean()),
	role: z.enum([UserRole.ADMIN, UserRole.USER]),
	email: z.optional(z.string().email()),
	image: z
		.any()
		.transform((val) => (val ? val : null)) // Transform non-existent/empty values to null
		.optional()
		.refine((value) => {
			// Custom validation function to validate image if uploaded
			if (!value) return true; // If no value (null), it's considered valid

			// Validation for image data if provided as base64 encoded string
			if (typeof value === 'string' && value.startsWith('data:image/')) {
				// Extracting the base64 part of the image data
				const base64Data = value.split(',')[1];
				// Calculating the size of the base64 data in bytes
				const fileSizeInBytes = (base64Data.length * 3) / 4 - 2;

				// Checking if the file size exceeds 50 MB
				const maxSizeInBytes = 50 * 1024 * 1024; // 50 MB in bytes

				if (fileSizeInBytes > maxSizeInBytes) {
					return false; // Validation fails if the file size exceeds the maximum
				}
			}

			// If it's not base64 encoded or within size limits, consider it valid
			return true;
		}, 'Please upload a valid image within 50 MB'),
});

export const LoginSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Email is required.' })
		.email('This is not a valid email.'),
	password: z
		.string()
		.min(1, 'Password is required.')
		.max(32, 'Password is too long.'),
	code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'This field has to be filled.' })
		.email('This is not a valid email.'),
	password: z
		.string()
		.min(6, 'Minimum 6 characters required')
		.max(32, 'Password is too long.'),
	name: z.string(),
});

export const NewPasswordSchema = z
	.object({
		password: z
			.string()
			.min(6, 'Minimum 6 characters required')
			.max(32, 'Password is too long.'),
		confirmPassword: z
			.string()
			.min(6, { message: 'Password must be at least 6 characters' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'], // path of error
	});

export const ResetSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'This field has to be filled.' })
		.email('This is not a valid email.'),
});
