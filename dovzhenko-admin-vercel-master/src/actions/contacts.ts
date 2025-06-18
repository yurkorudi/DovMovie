'use server';

import { z } from 'zod';
import { ContactSchema } from '@/schemas/contacts';
import { db } from '@/lib/db';

export const updateContacts = async (values: z.infer<typeof ContactSchema>) => {
	const validatedFields = ContactSchema.safeParse(values);

	if (!validatedFields.success) {
		return { message: 'Форма не пройшла валідацію!', success: false };
	}

	const { address, addressEng, phone, schedule, scheduleEng, email } =
		validatedFields.data;

	try {
		const existingContact = await db.contacts.findFirst();

		if (existingContact) {
			const response = await db.contacts.update({
				where: {
					id: existingContact.id,
				},
				data: {
					address,
					addressEng,
					phone,
					schedule,
					scheduleEng,
					email,
				},
			});

			if (response) {
				return { message: 'Контакти успішно оновлені', success: true };
			}
		} else {
			const response = await db.contacts.create({
				data: {
					address,
					addressEng,
					phone,
					schedule,
					scheduleEng,
					email,
				},
			});

			if (response) {
				return { message: 'Контакти успішно оновлені', success: true };
			}
		}
	} catch (e) {
		return { message: 'Помилка при оновленні контактів', success: false };
	}

	return { message: 'Помилка при оновленні контактів', success: false };
};

export const getContacts = async () => {
	const response = await db.contacts.findFirst();

	return response;
};
