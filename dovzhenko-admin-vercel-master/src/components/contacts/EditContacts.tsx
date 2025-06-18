'use client';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React, { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ContactSchema } from '@/schemas/contacts';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateContacts } from '@/actions/contacts';
import ToastMessage from '@/components/toasts/toast-message';
import { toast } from '@/components/ui/use-toast';
import ButtonLoader from '@/components/button-loader';

const defaultValues = {
	address: '',
	addressEng: '',
	schedule: '',
	scheduleEng: '',
	phone: '',
	email: '',
};

const EditContacts = ({
	contacts,
}: {
	contacts: z.infer<typeof ContactSchema> | null;
}) => {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof ContactSchema>>({
		resolver: zodResolver(ContactSchema),
		defaultValues,
	});

	const onSubmit = (data: z.infer<typeof ContactSchema>) => {
		startTransition(() => {
			updateContacts(data).then((data) => {
				toast({
					description: <ToastMessage data={data} />,
				});
			});
		});
	};

	useEffect(() => {
		form.reset({
			address: contacts?.address,
			addressEng: contacts?.addressEng,
			schedule: contacts?.schedule,
			scheduleEng: contacts?.scheduleEng,
			phone: contacts?.phone,
			email: contacts?.email,
		});
	}, [contacts]);

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
						name='address'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Адреса</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Напишіть адресу'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='addressEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Адреса англійською</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={'Напишіть адресу англійською'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='schedule'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Графік роботи</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Напишіть графік роботи'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='scheduleEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Графік роботи англійською</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={'Напишіть графік роботи англійською'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='phone'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Контактний телефон</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={'Напишіть контактний телефон'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Контактний email</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Напишіть контактний email'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex justify-end'>
						<ButtonLoader type='submit' disabled={isPending}>
							Зберегти
						</ButtonLoader>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default EditContacts;
