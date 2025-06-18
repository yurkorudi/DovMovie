'use client';
import CardWrapper from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '@/schemas';
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
import { register } from '@/actions/auth';
import { startTransition, useState, useTransition } from 'react';

const RegisterForm = () => {
	const [isPending] = useTransition();
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');
	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		setSuccess('');
		setError('');

		startTransition(() => {
			register(values).then((data) => {
				setError(data?.error || '');
				setSuccess(data?.message || '');
			});
		});
	};

	return (
		<CardWrapper
			backButtonLabel='Already have an account?'
			backButtonHref='/auth/login'
			headerLabel='Create an account'
			showSocials
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder={'Enter Name'} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='space-y-4'>
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
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} placeholder={'Enter Password'} />
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
						Register
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};

export default RegisterForm;
