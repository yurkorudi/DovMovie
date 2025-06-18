'use client';
import CardWrapper from '@/components/auth/card-wrapper';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { verificationEmail } from '@/actions/email';
import Loader from '@/components/loader/loader';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';

const VerificationForm = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const [error, setError] = useState<string | undefined>(undefined);
	const [success, setSuccess] = useState<string | undefined>(undefined);

	const onSubmit = useCallback(async () => {
		if (success || error) return;

		if (!token) setError('Invalid token');
		else {
			try {
				verificationEmail(token)
					.then((res) => {
						setSuccess(res.message);
						setError(res.error);
					})
					.catch((e) => {
						setError(e.message);
					});
			} catch (e: any) {
				setError(e.message);
			}
		}
	}, [token, success, error]);

	useEffect(() => {
		onSubmit();
	}, []);

	return (
		<CardWrapper
			headerLabel={'Email Verification...'}
			backButtonLabel={'Back to login'}
			backButtonHref={'/auth/login'}
			showSocials={false}
		>
			{!error && !success && <Loader />}
			{!success && <FormError message={error} />}
			<FormSuccess message={success} />
		</CardWrapper>
	);
};

export default VerificationForm;
