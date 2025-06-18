'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	MovieFormSchema,
	MovieResponseSchema,
	MovieSchema,
} from '@/schemas/movie';
import { useToast } from '@/components/ui/use-toast';
import dynamic from 'next/dynamic';
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
import ButtonLoader from '@/components/button-loader';
import { Card } from '@/components/ui/card';
import AddEditDatetimeModal from '@/components/modals/add-edit-datetime-modal';
import { Button } from '@/components/ui/button';
import TimeList from '@/components/movies/time-list';
import { Textarea } from '@/components/ui/textarea';
import ToastMessage from '@/components/toasts/toast-message';
import MySelect from '@/components/my-select';
import { appsSelect } from '@/constants/select';
import { createMovie, editSaveMovie } from '@/actions/movie';
import useEditMode from '@/hooks/use-edit-mode';
import { DateListType } from '@/lib/types/common';
import { showtimeToDateList } from '@/lib/map/movie';
import { handleImageChange } from '@/lib/images';

// const defaultValues = {
// 	title: 'Inception', // #
// 	titleEng: 'Inception', // #
// 	age: 'PG-13',
// 	ageEng: 'PG-13',
// 	genre: 'Sci-Fi',
// 	genreEng: 'Science Fiction',
// 	filmMaker: 'Christopher Nolan',
// 	filmMakerEng: 'Christopher Nolan',
// 	country: 'USA',
// 	countryEng: 'United States',
// 	duration: '148 min',
// 	durationEng: '148 minutes',
// 	description: 'A mind-bending thriller about dreams within dreams.', // #
// 	descriptionEng: 'A thrilling exploration of subconscious realms.', // #
// 	trailerLink: 'https://www.example.com/inception-trailer', //#
// 	ticketLink: 'https://www.example.com/inception-tickets', // #
// 	applications: [],
// 	poster: '',
// 	price: '10',
// };

const defaultValues = {
	title: '',
	titleEng: '',
	age: '',
	ageEng: '',
	genre: '',
	genreEng: '',
	filmMaker: '',
	filmMakerEng: '',
	country: '',
	countryEng: '',
	duration: '',
	durationEng: '',
	description: '',
	descriptionEng: '',
	trailerLink: '',
	ticketLink: '',
	applications: [],
	poster: '',
	price: '',
};

const AddEditMovie = ({
	movie,
	movieId,
}: {
	movie: z.infer<typeof MovieResponseSchema> | null;
	movieId: string | undefined;
}) => {
	const inputFileRef = useRef<HTMLInputElement>(null);
	const [files, setFiles] = useState<FileList | null>(null);
	const [isPending, startTransition] = useTransition();
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [dialogOpened, setDialogOpened] = useState(false);
	const [dateList, setDateList] = useState<DateListType[]>([]);
	const [editItem, setEditItem] = useState<DateListType | null>(null);
	const editMode = useEditMode();

	const mainForm = useForm<z.infer<typeof MovieSchema>>({
		resolver: zodResolver(MovieFormSchema),
		defaultValues,
	});

	const { toast } = useToast();

	const submitCreate = (data: z.infer<typeof MovieSchema>) => {
		startTransition(() => {
			const formData = new FormData();

			if (files !== null) {
				formData.append('files', files![0]);
			}

			createMovie(data, formData, dateList).then(async (data) => {
				if (data?.success) {
					mainForm.reset(defaultValues);
					setImagePreview(null);
					toast({
						description: <ToastMessage data={data} />,
					});
				} else {
					toast({
						description: <ToastMessage data={data} />,
					});
				}
			});
		});
	};

	const submitEditSave = (values: z.infer<typeof MovieSchema>) => {
		startTransition(() => {
			const formData = new FormData();

			if (inputFileRef.current?.files?.length) {
				const file = inputFileRef.current.files[0];

				formData.append('files', file);
			}

			const data = {
				...values,
				poster: formData.get('files') ? formData : movie?.poster,
			};

			editSaveMovie(data, formData, dateList, movieId!).then((data) => {
				toast({
					description: <ToastMessage data={data} />,
				});
			});
		});
	};

	const onSubmit = (data: z.infer<typeof MovieSchema>) => {
		if (!dateList.length) {
			toast({
				description: (
					<ToastMessage
						data={{
							message: 'Виберіть дату та час!',
							success: false,
						}}
					/>
				),
			});

			return;
		}

		if (editMode) {
			submitEditSave(data);

			return;
		}

		if (!files) {
			toast({
				description: (
					<ToastMessage
						data={{
							message: 'Виберіть постер!',
							success: false,
						}}
					/>
				),
			});

			return;
		}

		submitCreate(data);
	};

	const handleDeleteDates = (id: string) => {
		setDateList((prev) => prev.filter((item) => item.id !== id));
	};

	const handleAddTimeCard = (date: Date, timeArray: string[], id: string) => {
		const hasTheSameDate = dateList.some(
			(item) => new Date(item.date).getDate() === new Date(date).getDate(),
		);
		if (hasTheSameDate) {
			toast({
				description: (
					<ToastMessage
						data={{
							message: 'На це число вже є розклад',
							success: false,
						}}
					/>
				),
			});

			return;
		} else setDateList((prev) => [...prev, { date, time: timeArray, id }]);
	};

	useEffect(() => {
		if (editMode && movie) {
			mainForm.reset({
				title: movie?.title,
				titleEng: movie?.titleEng,
				age: movie?.age,
				genre: movie?.genre,
				genreEng: movie?.genreEng,
				filmMaker: movie?.filmMaker,
				filmMakerEng: movie?.filmMakerEng,
				country: movie?.country,
				countryEng: movie?.countryEng,
				duration: movie?.duration,
				description: movie?.description,
				descriptionEng: movie?.descriptionEng,
				trailerLink: movie?.trailerLink,
				ticketLink: movie?.ticketLink,
				applications: movie?.applications ? JSON.parse(movie.applications) : [],
				poster: '',
				price: movie?.price,
			});
			setImagePreview(movie?.poster || null);
			setDateList(showtimeToDateList(movie?.showtimes || []));
		}
	}, [editMode, movie]);

	return (
		<>
			<div className='mb-4 flex justify-end'>
				<Button className='text-sm' onClick={() => setDialogOpened(true)}>
					Додати розклад
				</Button>
			</div>
			<TimeList
				data={dateList}
				onEdit={(id) => {
					setDialogOpened(true);
					setEditItem(dateList.find((item) => item.id === id) ?? null);
				}}
				onDelete={handleDeleteDates}
			/>
			<Card className='mt-10 p-6 shadow-md'>
				<div>
					<AddEditDatetimeModal
						dialogOpened={dialogOpened}
						setDialogOpened={setDialogOpened}
						onSave={(date, timeArray, id) => {
							handleAddTimeCard(date, timeArray, id);
						}}
						onEditSave={(date, timeArray, id) => {
							setDateList((prev) =>
								prev.map((item) =>
									item.id === id ? { date, time: timeArray, id } : item,
								),
							);
							setEditItem(null);
						}}
						data={editItem}
					/>
				</div>
				<Form {...mainForm}>
					<form
						onSubmit={mainForm.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						{/*Title*/}
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
						{/*Age*/}
						<FormField
							control={mainForm.control}
							name='age'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Вік</FormLabel>
									<FormControl>
										<Input {...field} placeholder={'Напишіть вік'} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/*Genre*/}
						<FormField
							control={mainForm.control}
							name='genre'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Жанр</FormLabel>
									<FormControl>
										<Input {...field} placeholder={'Напишіть жанр'} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={mainForm.control}
							name='genreEng'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Жанр англійською</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={'Напишіть жанр англійською'}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/*FilmMaker*/}
						<FormField
							control={mainForm.control}
							name='filmMaker'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Режисер</FormLabel>
									<FormControl>
										<Input {...field} placeholder={'Напишіть режисера'} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={mainForm.control}
							name='filmMakerEng'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Режисер англійською</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={'Напишіть режисера англійською'}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/*Country*/}
						<FormField
							control={mainForm.control}
							name='country'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Країна</FormLabel>
									<FormControl>
										<Input {...field} placeholder={'Напишіть країну'} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={mainForm.control}
							name='countryEng'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Країна англійською</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={'Напишіть країну англійською'}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/*Duration*/}
						<FormField
							control={mainForm.control}
							name='duration'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Тривалість</FormLabel>
									<FormControl>
										<Input {...field} placeholder={'Напишіть тривалість'} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/*TicketLink*/}
						<FormField
							control={mainForm.control}
							name='ticketLink'
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
							control={mainForm.control}
							name='trailerLink'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Посилання на трейлер</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value ?? ''}
											placeholder={
												'Введіть посилання на трейлер (YouTube, Vimeo, тощо)'
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={mainForm.control}
							name='price'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ціна</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value ?? ''}
											placeholder={'Введіть ціну'}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={mainForm.control}
							name='applications'
							render={({ field: { onChange, value } }) => (
								<FormItem>
									<FormLabel htmlFor='typeImage'>Застосунки</FormLabel>
									<FormControl>
										<MySelect
											isMulti
											closeMenuOnSelect={false}
											options={appsSelect}
											placeholder='Виберіть застосунок(и)'
											value={value}
											onChange={(value) => {
												onChange(value);
											}}
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
										<Textarea {...field} placeholder={'Напишіть опис'} />
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
										<Textarea
											{...field}
											placeholder={'Напишіть опис англійською'}
										/>
									</FormControl>
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
										mainForm.setValue('poster', '');
									}}
									title='Видалити'
								>
									<Trash2 className='text-red-500 hover:text-red-600' />
								</div>
								<div className='relative h-[300px] max-w-[300px]'>
									<Image
										src={imagePreview}
										alt='preview'
										fill
										className='object-contain'
										unoptimized
									/>
								</div>
							</div>
						)}
						<FormField
							control={mainForm.control}
							name='poster'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Постер</FormLabel>
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
						<ButtonLoader type='submit' disabled={isPending}>
							Зберегти
						</ButtonLoader>
					</form>
				</Form>
			</Card>
		</>
	);
};

export default dynamic(() => Promise.resolve(AddEditMovie), {
	ssr: false,
});
