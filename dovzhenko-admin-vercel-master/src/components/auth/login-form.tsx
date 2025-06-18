'use client';
import CardWrapper from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schemas';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';
import { login } from '@/actions/auth';
import { startTransition, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { DEFAULT_REDIRECT } from '@/routes';

const LoginForm = () => {
	const [isPending] = useTransition();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');
	const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: '',
		},
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setSuccess('');
		setError('');

		startTransition(() => {
			login(values, callbackUrl || DEFAULT_REDIRECT)
				.then((data) => {
					if (data?.error) {
						form.reset();
						setError(data.error);
					}

					if (data?.success) {
						form.reset();
						setSuccess(data.success);
					}

					if (data?.twoFactor) {
						setShowTwoFactor(true);
					}
				})
				.catch(() => {
					setError('An error occurred, please try again');
				});
		});
	};

	return (
		<CardWrapper
			backButtonLabel='Dont have an account?'
			backButtonHref='/auth/register'
			headerLabel='З поверненням!'
			showSocials={false}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					{showTwoFactor && (
						<div className='mt-4'>
							<FormField
								control={form.control}
								name='code'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Two Factor code</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={'Enter the code sent to your email'}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}
					{!showTwoFactor && (
						<>
							<div className='mt-4'>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} placeholder={'Enter Email'} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='mt-4'>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder={'Enter Password'}
													type='password'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</>
					)}
					{/*<Link*/}
					{/*	href={'/auth/reset'}*/}
					{/*	className='spacey-0 mt-2 inline-block text-sm hover:underline'*/}
					{/*>*/}
					{/*	Forgot Password?*/}
					{/*</Link>*/}
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button
						type='submit'
						size='lg'
						className='w-full'
						disabled={isPending}
					>
						{showTwoFactor ? 'Confirm' : 'Увійти'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};

export default LoginForm;
