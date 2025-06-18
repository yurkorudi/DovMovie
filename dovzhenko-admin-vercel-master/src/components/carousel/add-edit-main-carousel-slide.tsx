'use client';
import React, { useEffect, useState, useTransition } from 'react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EventType } from '@prisma/client';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn, valueToSelectOption } from '@/lib/utils';
import moment from 'moment/moment';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import Image from 'next/image';
import Annotations from '@/components/annotations';
import useCurrentUser from '@/hooks/use-current-user';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { SlideSchema } from '@/schemas/carousel';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { handleCreateUpdateMainCarouselSlide } from '@/actions/carousel';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { parseSearchParams } from '@/lib/search-params';
import ToastMessage from '@/components/toasts/toast-message';
import { orderSelect, typeSelect } from '@/constants/select';
import MySelect from '@/components/my-select';
import useEditMode from '@/hooks/use-edit-mode';
import ButtonLoader from '@/components/button-loader';
import { handleImageChange } from '@/lib/images';

// const defaultValues = {
// 	startTime: new Date(),
// 	title: 'ДИВОVISION. ІЛЮЗІОН ШОУ',
// 	titleEng: 'ДИВОVISION. ІЛЮЗІОН ШОУ',
// 	description: 'ДИВОVISION. ІЛЮЗІОН ШОУ',
// 	descriptionEng: 'ДИВОVISION. ІЛЮЗІОН ШОУ',
// 	image: '',
// 	link: 'ДИВОVISION. ІЛЮЗІОН ШОУ',
// 	linkTitle: 'Купити квиток',
// 	linkTitleEng: 'Buy a ticket',
// 	typeImage: EventType.PERFORMANCE,
// 	dateForDisplay: `${moment().format('DD/MM/yyy')}`,
// 	dateForDisplayEng: `${moment().format('DD/MM/yyy')}`,
// };

const defaultValues = {
	startTime: new Date(),
	title: '',
	titleEng: '',
	description: '',
	descriptionEng: '',
	image: '',
	link: '',
	linkTitle: 'Купити квиток',
	linkTitleEng: 'Buy a ticket',
	typeImage: EventType.PERFORMANCE,
	dateForDisplay: `${moment().format('DD/MM/yyy')}`,
	dateForDisplayEng: `${moment().format('DD/MM/yyy')}`,
};

const AddEditMainCarouselSlide = () => {
	const inputFileRef = React.useRef<HTMLInputElement>(null);
	const [files, setFiles] = useState<FileList | null>(null);
	const [isPending, startTransition] = useTransition();
	const [imagePreview, setImagePreview] = React.useState<string | null>(null);
	const editMode = useEditMode();

	const user = useCurrentUser();
	const params = useSearchParams();

	const mainForm = useForm<z.infer<typeof SlideSchema>>({
		resolver: zodResolver(SlideSchema),
		defaultValues,
	});

	const { errors } = mainForm.formState;

	const { toast } = useToast();

	const setValuesFromParams = () => {
		if (editMode) {
			const values = parseSearchParams(params.toString());
			setImagePreview(values.image);

			delete values.image;

			mainForm.reset({
				...values,
				startTime: new Date(values.startTime),
				order: { value: values.order, label: values.order },
			});
		}
	};

	const onSubmit = async (values: z.infer<typeof SlideSchema>) => {
		const formData = new FormData();

		if (files !== null) {
			formData.append('files', files![0]);
		}

		// If it has new image pass formData
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
				handleCreateUpdateMainCarouselSlide(data, user.id!, editMode)
					.then((data) => {
						if (data.success && !editMode) {
							mainForm.reset(defaultValues);
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
		setValuesFromParams();
	}, []);

	useEffect(() => {
		Object.entries(errors).forEach(([key]) => {
			if (key === 'order') {
				toast({
					description: (
						<ToastMessage
							data={{
								message: 'Порядковий номер обовязковий!',
								success: false,
							}}
						/>
					),
				});
			}
		});
	}, [errors]);

	return (
		<Card className='mt-10 p-6 shadow-md'>
			<Form {...mainForm}>
				<form onSubmit={mainForm.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={mainForm.control}
						name='title'
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
						control={mainForm.control}
						name='titleEng'
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
						control={mainForm.control}
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
						control={mainForm.control}
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
						control={mainForm.control}
						name='link'
						render={({ field }) => (
							<FormItem>
								<FormLabel>* Посилання на купівлю квитка</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ''}
										placeholder={'Введіть посилання на купівлю квитка'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={mainForm.control}
						name='linkTitle'
						render={({ field }) => (
							<FormItem>
								<FormLabel>* Текст посилання</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ''}
										placeholder={'Введіть текст посилання на купівлю квитка'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={mainForm.control}
						name='linkTitleEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>* Текст посилання англійською</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ''}
										placeholder={
											'Введіть текст посилання на купівлю квитка англійською'
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={mainForm.control}
						name='typeImage'
						render={({ field: { onChange, value } }) => (
							<FormItem>
								<FormLabel htmlFor='typeImage'>Виберіть тип події</FormLabel>
								<FormControl>
									<MySelect
										options={typeSelect}
										placeholder='Тип події'
										value={valueToSelectOption(value)}
										onChange={(value) => {
											onChange(value.value);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={mainForm.control}
						name='dateForDisplay'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Дата для відображення</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={'Напишіть дату для відображення'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={mainForm.control}
						name='dateForDisplayEng'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Дата для відображення англійською</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={'Напишіть дату для відображення англійською'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={mainForm.control}
						name='startTime'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>** Дата події</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-[240px] pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground',
												)}
											>
												{field.value ? (
													moment(field.value).format('DD/MM/YYYY')
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0' align='start'>
										<Calendar
											captionLayout='dropdown'
											mode='single'
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) => date < new Date('2024-01-01')}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
					{imagePreview && (
						<div className='relative'>
							<div
								className='absolute right-[15px] top-[15px] z-10 cursor-pointer rounded-full p-1 '
								onClick={() => {
									setImagePreview(null);
									mainForm.setValue('image', '');
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
						control={mainForm.control}
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
											setFiles(e.target.files);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Controller
						control={mainForm.control}
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
					<Annotations
						annotations={[
							"Для того щоб показати в події надпис 'вхід вільний' просто залиште поля з текстами і посиланнями пустими",
							'Дата подіїї використовується для програмного сортування подій на головній сторінці',
						]}
					/>
					<ButtonLoader type='submit' disabled={isPending}>
						{editMode ? 'Зберегти' : 'Створити'}
					</ButtonLoader>
				</form>
			</Form>
		</Card>
	);
};

export default dynamic(() => Promise.resolve(AddEditMainCarouselSlide), {
	ssr: false,
});
