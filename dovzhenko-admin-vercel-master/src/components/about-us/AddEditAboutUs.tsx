'use client';
import { z } from 'zod';
import React, { useEffect, useTransition } from 'react';
import useCurrentUser from '@/hooks/use-current-user';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import ToastMessage from '@/components/toasts/toast-message';
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
import MySelect from '@/components/my-select';
import { orderSelect } from '@/constants/select';
import { AboutSchema, AboutSchemaDB } from '@/schemas/about';
import { handleCreateUpdateAboutSlide } from '@/actions/about-us';
import ButtonLoader from '@/components/button-loader';
import { handleImageChange } from '@/lib/images';

const defaultValues = {
	createdBy: {
		name: '',
	},
	createdById: '',
	name: '',
	nameEng: '',
	surname: '',
	surnameEng: '',
	id: '',
	position: '',
	positionEng: '',
	image: '',
	secondImage: '',
};

const AddEditAboutUs = ({
	slide,
}: {
	slide: z.infer<typeof AboutSchemaDB> | null;
}) => {
	const editMode = slide !== null;
	const inputFileRef = React.useRef<HTMLInputElement>(null);
	const secondInputFileRef = React.useRef<HTMLInputElement>(null);
	const [isPending, startTransition] = useTransition();
	const [imagePreview, setImagePreview] = React.useState<string | null>(null);
	const [secondImagePreview, setSecondImagePreview] = React.useState<
		string | null
	>(null);
	const { toast } = useToast();

	const user = useCurrentUser();

	const form = useForm<z.infer<typeof AboutSchema>>({
		resolver: zodResolver(AboutSchema),
		defaultValues,
	});

	const { errors } = form.formState;

	const onSubmit = (values: z.infer<typeof AboutSchema>) => {
		const formData = new FormData();
		const formDataSecond = new FormData();

		if (
			inputFileRef.current?.files?.length &&
			secondInputFileRef.current?.files?.length
		) {
			const image = inputFileRef.current.files[0];
			const secondImage = secondInputFileRef.current.files[0];

			formData.append('files', image);
			formDataSecond.append('files', secondImage);
		}

		const data =
			formData.get('files') && formDataSecond.get('files')
				? {
						...values,
						image: formData,
						secondImage: formDataSecond,
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

			if (!secondImagePreview) {
				toast({
					description: (
						<ToastMessage
							data={{ message: 'Друге зображення обовязкове!', success: false }}
						/>
					),
				});

				return;
			}

			if (user && imagePreview && secondImagePreview) {
				handleCreateUpdateAboutSlide(data, user.id!, editMode)
					.then((data) => {
						if (data.success && !editMode) {
							form.reset(defaultValues);
							setImagePreview(null);
							setSecondImagePreview(null);
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
					name: slide?.createdBy?.name,
				},
				createdById: slide?.createdById,
				id: slide?.id,
				name: slide?.name,
				nameEng: slide?.nameEng,
				surname: slide?.surname,
				surnameEng: slide?.surnameEng,
				position: slide?.position,
				positionEng: slide?.positionEng,
				order: { value: slide?.order, label: slide?.order },
			});
			setImagePreview(slide?.image);
			setSecondImagePreview(slide?.secondImage);
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
								<FormLabel>Ім&apos;я</FormLabel>
								<FormControl>
									<Input {...field} placeholder={"Напишіть Ім'я"} />
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
								<FormLabel>Ім&apos;я англійською</FormLabel>
								<FormControl>
									<Input {...field} placeholder={"Напишіть Ім'я англійською"} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='surname'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Прізвище</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Напишіть Прізвище'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='surnameEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Прізвище англійською</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={'Напишіть Прізвище англійською'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='position'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Посада</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Посада'} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='positionEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Посада англійською</FormLabel>
								<FormControl>
									<Input {...field} placeholder={'Посада англійською'} />
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

					<div className='flex gap-x-4'>
						<div className='max-w-[280px] basis-3/6'>
							{imagePreview && (
								<div>
									<p className='mb-1 font-semibold'>Головне зображення</p>
									<div className='relative h-[350px] w-[280px]'>
										<div
											className='absolute right-[15px] top-[15px] z-10 cursor-pointer rounded-full p-1 '
											onClick={() => {
												setImagePreview(null);
												form.setValue('image', '');
											}}
											title='Видалити'
										>
											<Trash2 className='text-red-500 hover:text-red-600' />
										</div>
										<div className='relative h-[350px] w-[280px]'>
											<img
												src={imagePreview}
												alt='preview'
												className='object-cover'
											/>
										</div>
									</div>
								</div>
							)}
						</div>
						<div className='max-w-[280px] basis-3/6'>
							{secondImagePreview && (
								<div>
									<p className='mb-1 font-semibold'>Друге зображення</p>
									<div className='relative h-[350px] w-[280px]'>
										<div
											className='absolute right-[15px] top-[15px] z-10 cursor-pointer rounded-full p-1'
											onClick={() => {
												setSecondImagePreview(null);
												form.setValue('secondImage', '');
											}}
											title='Видалити'
										>
											<Trash2 className='text-red-500 hover:text-red-600' />
										</div>
										<div className='relative h-[350px] w-[280xp]'>
											<img
												src={secondImagePreview}
												alt='preview'
												className='object-cover'
											/>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className='flex gap-x-4'>
						<FormField
							control={form.control}
							name='image'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Зображення</FormLabel>
									<FormControl className='w-[280px]'>
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
						<FormField
							control={form.control}
							name='secondImage'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Друге Зображення</FormLabel>
									<FormControl className='w-[280px]'>
										<Input
											{...field}
											type='file'
											ref={secondInputFileRef}
											onChange={(e) => {
												field.onChange(e);
												handleImageChange(e, setSecondImagePreview);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<ButtonLoader type='submit' disabled={isPending}>
						{editMode ? 'Зберегти' : 'Створити'}
					</ButtonLoader>
				</form>
			</Form>
		</Card>
	);
};

export default AddEditAboutUs;
