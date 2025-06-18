'use client';
import CardWrapper from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetSchema } from '@/schemas';
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
import { reset } from '@/actions/auth';
import { startTransition, useState, useTransition } from 'react';

const ResetForm = () => {
	const [isPending] = useTransition();
	const [error, setError] = useState<string>('');
	const [success, setSuccess] = useState<string>('');
	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
		setSuccess('');
		setError('');

		startTransition(() => {
			reset(values).then((data) => {
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

export default ResetForm;
