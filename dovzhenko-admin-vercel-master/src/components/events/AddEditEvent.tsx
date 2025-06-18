'use client';
import { EventSchemaDB } from '@/schemas/event';
import { z } from 'zod';
import React, { useEffect, useTransition } from 'react';
import useCurrentUser from '@/hooks/use-current-user';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventType } from '@prisma/client';
import { Card } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import ToastMessage from '@/components/toasts/toast-message';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import MySelect from '@/components/my-select';
import { typeSelect } from '@/constants/select';
import { cn, valueToSelectOption } from '@/lib/utils';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import Image from 'next/image';
import Annotations from '@/components/annotations';
import { handleCreateUpdateEvent } from '@/actions/events';
import { Checkbox } from '@/components/ui/checkbox';
import ButtonLoader from '@/components/button-loader';
import { handleImageChange } from '@/lib/images';

const defaultValues = {
	createdBy: {
		name: '',
	},
	createdById: '',
	title: '',
	titleEng: '',
	cardDescription: '',
	cardDescriptionEng: '',
	id: '',
	startTime: new Date(),
	startDateString: '',
	startDateStringEng: '',
	link: '',
	typeImage: EventType.PERFORMANCE,
	backgroundImage: undefined,
	freeEntry: false,
};

const AddEditEvent = ({
	event,
}: {
	event: z.infer<typeof EventSchemaDB> | null;
}) => {
	const editMode = event !== null;
	const inputFileRef = React.useRef<HTMLInputElement>(null);
	const [isPending, startTransition] = useTransition();
	const [imagePreview, setImagePreview] = React.useState<string | null>(null);

	const user = useCurrentUser();

	const form = useForm<z.infer<typeof EventSchemaDB>>({
		resolver: zodResolver(EventSchemaDB),
		defaultValues,
	});

	const { errors } = form.formState;

	useEffect(() => {
		if (Object.entries(errors).length) {
			console.log('errors', errors);
		}
	}, [errors]);

	const { toast } = useToast();

	const onSubmit = (values: z.infer<typeof EventSchemaDB>) => {
		const formData = new FormData();

		if (inputFileRef.current?.files?.length) {
			const file = inputFileRef.current.files[0];

			formData.append('files', file);
		}

		const data = formData.get('files')
			? {
					...values,
					backgroundImage: formData,
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
				handleCreateUpdateEvent(data, user.id!, editMode)
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
					name: event?.createdBy?.name,
				},
				createdById: event?.createdById,
				title: event?.title,
				titleEng: event?.titleEng,
				cardDescription: event?.cardDescription,
				cardDescriptionEng: event?.cardDescriptionEng,
				id: event?.id,
				startTime: event?.startTime,
				startDateString: event?.startDateString,
				startDateStringEng: event?.startDateStringEng,
				link: event?.link,
				typeImage: event?.typeImage,
				freeEntry: event?.freeEntry,
			});
			setImagePreview(event?.backgroundImage);
		}
	}, [editMode]);

	return (
		<Card className='mt-10 p-6 shadow-md'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
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
						control={form.control}
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
						control={form.control}
						name='cardDescription'
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
						name='cardDescriptionEng'
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
						name='link'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Посилання на купівлю квитка</FormLabel>
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
						control={form.control}
						name='typeImage'
						render={({ field: { onChange, value } }) => (
							<FormItem>
								<FormLabel htmlFor='typeImage'>Виберіть тип події</FormLabel>
								<FormControl>
									<MySelect
										options={typeSelect}
										placeholder='Тип події'
										value={valueToSelectOption(value)}
										onChange={(value) => onChange(value.value)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='startDateString'
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
						control={form.control}
						name='startDateStringEng'
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
						control={form.control}
						name='startTime'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>* Дата події</FormLabel>
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
									form.setValue('backgroundImage', '');
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
						name='backgroundImage'
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
					<FormField
						control={form.control}
						name='freeEntry'
						render={({ field }) => (
							<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className='space-y-1 leading-none'>
									<FormLabel>
										Поставте галочку, щоб зробити вхід вільним
									</FormLabel>
									<FormDescription>
										Цей чекбокс вказує, що ви хочете зробити подію безкоштовною
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>
					<Annotations
						annotations={[
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

export default AddEditEvent;
