import { z } from 'zod';

export const formSchema = z.object({
	name: z
		.string()
		.min(3, 'Name is required')
		.max(50, 'Name cannot exceed 50 characters'),
	text: z
		.string()
		.min(1, 'Message is required')
		.max(500, 'Message cannot exceed 500 characters'),
	phone: z.string().min(10, 'Phone number is too short'),
});
