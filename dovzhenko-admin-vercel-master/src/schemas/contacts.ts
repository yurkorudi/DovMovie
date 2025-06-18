import { z } from 'zod';

export const ContactSchema = z.object({
	address: z.string().min(5, 'Адреса має містити мінімум 5 символів'),
	addressEng: z.string().min(5, 'Адреса має містити мінімум 5 символів'),
	email: z.string().min(5, 'Email має містити мінімум 5 символів'),
	phone: z.string().min(10, 'Телефон має містити мінімум 10 символів'),
	schedule: z.string().min(5, 'Графік роботи має містити мінімум 5 символів'),
	scheduleEng: z
		.string()
		.min(5, 'Графік роботи має містити мінімум 5 символів'),
});
