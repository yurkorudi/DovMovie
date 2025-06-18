'use client';
import CardWrapper from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPasswordSchema } from '@/schemas';
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
import { newPassword } from '@/actions/auth';
import { startTransition, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';

const NewPasswordForm = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const [isPending] = useTransition();
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');
	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		setSuccess('');
		setError('');

		startTransition(() => {
			newPassword(values, token).then((data) => {
				setError(data?.error || '');
				setSuccess(data?.message || '');
			});
		});
	};

	return (
		<CardWrapper
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
			headerLabel='Forgot your password ?'
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<div className='mt-4'>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} placeholder={'******'} type='password' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='mt-4'>
						<FormField
							control={form.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input {...field} placeholder={'******'} type='password' />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Button
						type='submit'
						size='lg'
						className='w-full'
						disabled={isPending}
					>
						Send reset email
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};

export default NewPasswordForm;
