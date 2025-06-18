'use client';

import { useForm } from 'react-hook-form';
import { formSchema } from '@/schemas/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { t } from '@/hooks/use-lang';
import { Forum } from 'next/font/google';
import clsx from 'clsx';
import localFont from 'next/font/local';
import { useEffect } from 'react';
import { sendMessage } from '@/actions';

const ForumSans = Forum({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const Gilroy = localFont({
	src: '../../../public/fonts/Gilroy-Thin.woff',
});

const GetInTouchForm = ({
	id,
	onSuccess,
}: {
	id: number;
	onSuccess: () => void;
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			text: '',
			phone: '',
		},
	});

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('phone', data.phone);
		formData.append('text', data.text);
		formData.append('type', id.toString());
		sendMessage(formData).then((res) => {
			if (!res.success) {
				alert('Помилка відправлення повідомлення');
			} else {
				onSuccess();
			}
		});
	};

	const getSource = () => {
		switch (id) {
			case 0:
				return '/static/images/cooperation/concert-hall/hall_1_1.jpg';
			case 1:
				return '/static/images/cooperation/rectangle-freeze.jpg';
			case 2:
				return '/static/images/cooperation/jazz-hall/1.webp';
			case 3:
				return '/static/images/cooperation/roof/1.webp';
			default:
				return '/static/images/cooperation/roof/1.webp';
		}
	};

	const getTitle = () => {
		switch (id) {
			case 0:
				return t(['Оренда кінозалу', 'Cinema Hall Rent']);
			case 1:
				return t(['Оренда концертного залу', 'Concert Hall Rent']);
			case 2:
				return t(['Оренда залу для конференцій', 'Conference Hall Rent']);
			case 3:
				return t(['Оренда дахової площадки', 'Roof Rent']);
			default:
				return 'Roof';
		}
	};

	useEffect(() => {
		console.log('errors', errors);
	}, [errors]);

	return (
		<div className='mx-auto max-w-[540px]'>
			<Image
				src={getSource()}
				alt='hall image'
				width={500}
				height={300}
				className='max-h-[300px] object-cover'
			/>
			<h2
				className={clsx(
					ForumSans.className,
					'my-5 text-[40px] leading-[44px] text-white',
				)}
			>
				{getTitle()}
			</h2>
			<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
				{/* Name Field */}
				<div>
					<input
						type='text'
						placeholder={t([
							'Ім’я замовника чи організації',
							'Name of the customer or organization',
						])}
						id='name'
						className={clsx(
							Gilroy.className,
							'mt-1 block w-full border-b bg-transparent text-base text-white focus-visible:outline-none',
							{
								'border-red-500': errors.name,
							},
						)}
						{...register('name')}
					/>
				</div>

				{/* Phone Field */}
				<div>
					<input
						type='text'
						id='phone'
						placeholder='+38'
						className={clsx(
							Gilroy.className,
							'mt-1 block w-full border-b bg-transparent text-base text-white focus-visible:outline-none',
							{
								'border-red-500': errors.phone,
							},
						)}
						{...register('phone')}
					/>
				</div>

				{/* Message Field */}
				<div>
					<textarea
						id='text'
						placeholder={t(['Опис звернення', 'Message'])}
						className={clsx(
							Gilroy.className,
							'mt-1 block w-full border-b bg-transparent text-base text-white focus-visible:outline-none',
							{
								'border-red-500': errors.text,
							},
						)}
						{...register('text')}
					/>
				</div>

				{/* Submit Button */}
				<div className='flex justify-end'>
					<button
						type='submit'
						className='uppercase text-gold underline underline-offset-4 hover:text-gold-hover'
					>
						{t(['Надіслати', 'Send'])}
					</button>
				</div>
			</form>
		</div>
	);
};

export default GetInTouchForm;
