'use client';
import { StudioSchema, StudioSchemaDB } from '@/schemas/studio';
import { z } from 'zod';
import React, { useEffect, useTransition } from 'react';
import useCurrentUser from '@/hooks/use-current-user';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import ToastMessage from '@/components/toasts/toast-message';
import { handleCreateUpdateStudio } from '@/actions/studios';
import { Card } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import MySelect from '@/components/my-select';
import { orderSelect } from '@/constants/select';
import ButtonLoader from '@/components/button-loader';
import { handleImageChange } from '@/lib/images';

const defaultValues = {
	createdBy: {
		name: '',
	},
	createdById: '',
	name: '',
	nameEng: '',
	description: '',
	descriptionEng: '',
	id: '',
	contactsName: '',
	contactsNameEng: '',
	contactsPhone: '',
	ageDiapason: '',
	ageDiapasonEng: '',
	scheduleDays: '',
	scheduleDaysEng: '',
	scheduleTime: '',
	scheduleTimeEng: '',
	image: '',
};

const AddEditStudio = ({
	studio,
}: {
	studio: z.infer<typeof StudioSchemaDB> | null;
}) => {
	const editMode = studio !== null;
	const inputFileRef = React.useRef<HTMLInputElement>(null);
	const [isPending, startTransition] = useTransition();
	const [imagePreview, setImagePreview] = React.useState<string | null>(null);
	const { toast } = useToast();

	const user = useCurrentUser();

	const form = useForm<z.infer<typeof StudioSchema>>({
		resolver: zodResolver(StudioSchema),
		defaultValues,
	});

	const { errors } = form.formState;

	const onSubmit = (values: z.infer<typeof StudioSchema>) => {
		const formData = new FormData();

		if (inputFileRef.current?.files?.length) {
			const file = inputFileRef.current.files[0];

			formData.append('files', file);
		}

		const data = formData.get('files')
			? {
					...values,
					image: formData,
				}
			: values;

		startTransition(() => {
			if (!imagePreview) {
				toast({
					description: (
						<ToastMessage
							data={{ message: 'Зображення обовязкове!', success: false }}
						/>
					),
				});

				return;
			}

			if (user && imagePreview) {
				handleCreateUpdateStudio(data, user.id!, editMode)
					.then((data) => {
						if (data.success && !editMode) {
							form.reset(defaultValues);
							setImagePreview(null);
						}

						// if (data.success && editMode) mainForm.reset(data.result);

						toast({
							description: <ToastMessage data={data} />,
						});
					})
					.catch((e) => {
						console.log('error', e);
					});
			}
		});
	};

	useEffect(() => {
		if (editMode) {
			form.reset({
				createdBy: {
					name: studio?.createdBy?.name,
				},
				createdById: studio?.createdById,
				name: studio?.name,
				nameEng: studio?.nameEng,
				description: studio?.description,
				descriptionEng: studio?.descriptionEng,
				id: studio?.id,
				contactsName: studio?.contactsName,
				contactsNameEng: studio?.contactsNameEng,
				contactsPhone: studio?.contactsPhone,
				ageDiapason: studio?.ageDiapason,
				ageDiapasonEng: studio?.ageDiapasonEng,
				scheduleDays: studio?.scheduleDays,
				scheduleDaysEng: studio?.scheduleDaysEng,
				scheduleTime: studio?.scheduleTime,
				scheduleTimeEng: studio?.scheduleTimeEng,
				order: { value: studio?.order, label: studio?.order },
			});
			setImagePreview(studio?.image);
		}
	}, [editMode]);

	useEffect(() => {
		if (Object.entries(errors).length) {
			console.log('errors', errors);
		}
	}, [errors]);

	return (
		<Card className='mt-10 p-6 shadow-md'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Заголовок</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Напишіть заголовок'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='nameEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Заголовок англійською</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={'Напишіть заголовок англійською'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Опис</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Напишіть опис'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='descriptionEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Опис англійською</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Напишіть опис англійською'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='contactsName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ім&apos;я керівника</FormLabel>
								<FormControl>
									<Input {...field} placeholder={"Ім'я керівника"} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='contactsNameEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ім&apos;я керівника англійською</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={"Ім'я керівника англійською"}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='contactsPhone'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Телефон</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Контактний телефон'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='ageDiapason'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Віковий діапазон</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Введіть віковий діапазон'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='ageDiapasonEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Віковий діапазон англійською</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={'Напишіть віковий діапазон англійською'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='scheduleDays'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Робочі дні</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Напишіть робочі дні'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='scheduleDaysEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Робочі дні англійською</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={'Напишіть робочі дні англійською'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='scheduleTime'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Робочі години</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Напишіть робочі години'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='scheduleTimeEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Робочі години англійською</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={'Напишіть робочі години англійською'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Controller
						control={form.control}
						name='order'
						render={({ field: { onChange, value } }) => (
							<FormItem>
								<FormLabel htmlFor='order'>
									Виберіть порядковий номер елемента
								</FormLabel>
								<FormControl className='w-[280px]'>
									<MySelect
										options={orderSelect}
										placeholder='Виберіть порядковий номер'
										value={value}
										onChange={onChange}
									/>
								</FormControl>
								<FormMessage>{errors?.order?.message}</FormMessage>
							</FormItem>
						)}
					/>
					{imagePreview && (
						<div className='relative'>
							<div
								className='absolute right-[15px] top-[15px] z-10 cursor-pointer rounded-full p-1'
								onClick={() => {
									setImagePreview(null);
									form.setValue('image', '');
								}}
								title='Видалити'
							>
								<Trash2 className='text-red-500 hover:text-red-600' />
							</div>
							<div className='relative h-[600px]'>
								<Image
									src={imagePreview}
									alt='preview'
									fill
									sizes='(max-width: 100%) 100%, 600px'
									className='object-cover'
									unoptimized
								/>
							</div>
						</div>
					)}
					<FormField
						control={form.control}
						name='image'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Зображення</FormLabel>
								<FormControl className='w-[240px]'>
									<Input
										{...field}
										type='file'
										ref={inputFileRef}
										onChange={(e) => {
											field.onChange(e);
											handleImageChange(e, setImagePreview);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<ButtonLoader type='submit' disabled={isPending}>
						{editMode ? <span>Зберегти</span> : <span>Створити</span>}
					</ButtonLoader>
				</form>
			</Form>
		</Card>
	);
};

export default AddEditStudio;
