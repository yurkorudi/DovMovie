'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { updateCredentials, updateSettings } from '@/actions/settings';
import {
	ChangeEvent,
	startTransition,
	useEffect,
	useRef,
	useState,
	useTransition,
} from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { CredentialsSchema, SettingsSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useCurrentUser from '@/hooks/use-current-user';
import FormError from '@/components/form-error';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { UserRole } from '.prisma/client';
import { Switch } from '@/components/ui/switch';
import ScreenLoader from '@/components/loader/screen-loader';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { Merriweather as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { API_ROUTES } from '@/routes';
import ToastMessage from '@/components/toasts/toast-message';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
});

const SettingsPage = () => {
	const { update } = useSession();
	const [isPending] = useTransition();
	const inputFileRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string | undefined>();
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [errorCredentials, setErrorCredentials] = useState<
		string | undefined
	>();
	const user = useCurrentUser();
	const { toast } = useToast();

	// TODO: check validity
	const uploadFile = async (formData: FormData) => {
		try {
			const response = await fetch(API_ROUTES.UPLOAD, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Failed to upload file');
			}

			await update();
			setPreviewUrl(null);
		} catch (error) {
			console.error('Upload failed:', error);
		}
	};

	const credentialsForm = useForm<z.infer<typeof CredentialsSchema>>({
		resolver: zodResolver(CredentialsSchema),
		defaultValues: {
			password: '',
			newPassword: '',
		},
	});

	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: user?.name || '',
			email: user?.email || '',
			role: user?.role,
			isTwoFactorEnabled: user?.isTwoFactorEnabled,
			image: user?.image,
		},
	});

	const onSubmitCredentials = (values: z.infer<typeof CredentialsSchema>) => {
		startTransition(() => {
			updateCredentials(values)
				.then(async (data) => {
					if (data?.error) {
						setErrorCredentials(data.error);
					} else {
						await update();
						toast({
							description: (
								<ToastMessage
									data={{ message: 'Credentials updated!', success: true }}
								/>
							),
						});
					}
				})
				.catch((e) => {
					setError(e.message);
				});
		});
	};

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		if (inputFileRef.current?.files?.length) {
			const formData = new FormData();
			const file = inputFileRef.current.files[0];
			formData.append('files', file);
			if (user?.id) formData.append('userId', user?.id);

			uploadFile(formData);
		}

		startTransition(() => {
			updateSettings(values)
				.then(async (data) => {
					if (data.error) {
						setError(data.error);
					} else {
						await update();
						toast({
							description: (
								<ToastMessage
									data={{ message: 'Profile updated!', success: true }}
								/>
							),
						});
					}
				})
				.catch((e) => {
					setError(e.message);
				});
		});
	};

	const handleFileChoose = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];

		if (selectedFile) {
			setPreviewUrl(URL.createObjectURL(selectedFile));
		}
	};

	useEffect(() => {
		form.reset({
			name: user?.name || '',
			email: user?.email || '',
			role: user?.role,
			isTwoFactorEnabled: user?.isTwoFactorEnabled,
			image: user?.image,
		});
	}, [user]);

	const defineAvatar = (field: any) => {
		if (field?.value) return field?.value;

		return '/avatar.png';
	};

	return (
		<>
			<ScreenLoader show={!user?.name} />
			<div className='space-y-8'>
				<Card className='w-full border shadow-none'>
					<CardHeader className='border-b px-6 py-3'>
						<p className={cn(fontSans.className, 'text-md font-semibold')}>
							Your profile
						</p>
					</CardHeader>
					<CardContent className='p-6'>
						<Form {...form}>
							<form
								className='space-y-4'
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<FormField
									control={form.control}
									name='image'
									render={({ field }) => (
										<FormItem className='flex gap-4'>
											<FormLabel htmlFor='image' className='cursor-pointer'>
												<div className='overflow-hidden rounded-sm'>
													{/*// TODO: Add a fallback image is load*/}
													{!previewUrl && (
														<Image
															width={48}
															height={48}
															className='max-h-[48px] max-w-[48px] object-cover'
															src={defineAvatar(field)}
															alt='avatar'
														/>
													)}
													{previewUrl && (
														<Image
															width={48}
															height={48}
															className='max-h-[48px] max-w-[48px] object-cover'
															src={previewUrl}
															alt='avatar'
														/>
													)}
												</div>
											</FormLabel>
											<FormControl>
												<Input
													type='file'
													className='hidden'
													id='image'
													ref={inputFileRef}
													onChange={handleFileChoose}
												/>
											</FormControl>
											<div className={cn(fontSans.className)}>
												<span>Profile picture</span>
												<span className='mt-1 block text-xs font-normal'>
													Use a photo or image that is 132px square or larger.
												</span>
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder='John Doe'
													disabled={isPending}
													id={field.name}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{user?.isOAuth ? null : (
									<>
										<FormField
											control={form.control}
											name='email'
											render={({ field }) => (
												<FormItem>
													<FormLabel htmlFor='email'>Email</FormLabel>
													<FormControl>
														<Input
															{...field}
															id='email'
															type='email'
															placeholder='johndoe@example.com'
															disabled={isPending}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</>
								)}
								<FormField
									control={form.control}
									name='role'
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor='role'>Role</FormLabel>
											<FormControl>
												<Select
													disabled={isPending}
													onValueChange={field.onChange}
													defaultValue={field.value}
													value={field?.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder='Select a role' />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value={UserRole.ADMIN}>
															Admin
														</SelectItem>
														<SelectItem value={UserRole.USER}>User</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{user?.isOAuth ? null : (
									<FormField
										control={form.control}
										name='isTwoFactorEnabled'
										render={({ field }) => (
											<FormItem className='rounder-lg flex flex-row items-center justify-between border p-3 shadow-sm'>
												<div className='space-y-0.5'>
													<FormDescription>
														<span>Two-factor authentication</span>
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														disabled={isPending}
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								)}
								<FormError message={error} />
								<Button type='submit' disabled={isPending}>
									Save
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
				{user?.isOAuth ? null : (
					<Card className=' w-full border shadow-none'>
						<CardHeader className='border-b px-6 py-3'>
							<p className={cn(fontSans.className, 'text-md font-semibold')}>
								Credentials
							</p>
						</CardHeader>
						<CardContent className='p-6'>
							<Form {...credentialsForm}>
								<form
									className='space-y-4'
									onSubmit={credentialsForm.handleSubmit(onSubmitCredentials)}
								>
									<FormField
										control={credentialsForm.control}
										name='password'
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor='password'>
													Current Password
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														id='password'
														type='password'
														placeholder='******'
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={credentialsForm.control}
										name='newPassword'
										render={({ field }) => (
											<FormItem>
												<FormLabel htmlFor='newPassword'>
													New Password
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														id='newPassword'
														type='password'
														placeholder='******'
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormError message={errorCredentials} />
									<Button type='submit' disabled={isPending}>
										Save
									</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				)}
			</div>
		</>
	);
};

export default SettingsPage;
