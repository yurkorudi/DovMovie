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
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema, UserSchemaDB } from '@/schemas/user';
import { Card } from '@/components/ui/card';
import ButtonLoader from '@/components/button-loader';
import { createUser, updateUser } from '@/actions/users';
import ToastMessage from '@/components/toasts/toast-message';
import { toast } from '@/components/ui/use-toast';
import { usePathname } from 'next/navigation';
import { ROUTER_PATHS } from '@/routes';

const defaultValues = {
	name: '',
	email: '',
	password: '',
};

const AddEditUser = ({
	user,
	userId,
}: {
	user: z.infer<typeof UserSchemaDB> | null;
	userId: string;
}) => {
	const pathname = usePathname();
	const isEditMode = user !== null && pathname === ROUTER_PATHS.EDIT_USER;
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof UserSchema>>({
		resolver: zodResolver(UserSchema),
		defaultValues,
	});

	const { errors } = form.formState;

	const onCreateUser = (values: z.infer<typeof UserSchema>) => {
		startTransition(() => {
			createUser(values)
				.then((res) => {
					toast({
						description: (
							<ToastMessage
								data={{
									message: res?.message,
									success: true,
								}}
							/>
						),
					});
				})
				.catch((e) => {
					console.log('error', e);
				});
		});
	};

	const onUpdateUser = (values: z.infer<typeof UserSchema>) => {
		startTransition(() => {
			updateUser(values, userId)
				.then((res) => {
					toast({
						description: (
							<ToastMessage
								data={{
									message: res?.message || '',
									success: true,
								}}
							/>
						),
					});
				})
				.catch((e) => {
					console.log('error', e);
				});
		});
	};

	useEffect(() => {
		const errorsObject = Object.entries(errors).reverse();

		if (errorsObject.length) {
			errorsObject.forEach(([, value]) => {
				toast({
					description: (
						<ToastMessage
							data={{
								message: value?.message || '',
								success: false,
							}}
						/>
					),
				});
			});
		}
	}, [errors]);

	useEffect(() => {
		if (isEditMode) {
			form.reset({
				name: user?.name || '',
				email: user?.email || '',
				password: '',
			});
		}
	}, [isEditMode]);

	return (
		<Card className='mt-10 p-6 shadow-md'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(isEditMode ? onUpdateUser : onCreateUser)}
					className='space-y-4'
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ім&apos;я</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={"Напишіть Ім'я, наприклад: Андрій Шевченко"}
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
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Напишіть email'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>{isEditMode ? 'Новий пароль' : 'Пароль'}</FormLabel>
								<FormControl>
									<Input {...field} placeholder='Напишіть пароль' />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex justify-end'>
						<ButtonLoader type='submit' disabled={isPending}>
							{isEditMode ? 'Зберегти' : 'Додати користувача'}
						</ButtonLoader>
					</div>
				</form>
			</Form>
		</Card>
	);
};

export default AddEditUser;
