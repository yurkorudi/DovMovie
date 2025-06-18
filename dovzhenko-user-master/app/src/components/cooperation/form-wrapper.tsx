'use client';
import LargeContainer from '@/components/containers/large-container';
import GetInTouchForm from '@/components/cooperation/get-in-touch-form';
import Footer from '@/components/footer/footer';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { t } from '@/hooks/use-lang';

const FormWrapper = () => {
	const { id } = useParams();
	const [formSent, setFormSent] = useState(true);
	const router = useRouter();

	return (
		<div
			style={{
				backgroundImage:
					'linear-gradient(rgb(37, 20, 71) 0%, rgba(43, 29, 112, 0.4) 60%, rgba(37, 20, 71, 0.7) 72.4%, rgb(37, 20, 71) 100%), url("/static/images/cooperation/background.webp")',
			}}
			className='flex flex-shrink-0 flex-grow flex-col bg-cover bg-center bg-no-repeat'
		>
			<LargeContainer className='flex flex-shrink-0 flex-grow flex-col justify-center'>
				<div className='mx-auto max-w-[1110px]'>
					{!formSent && (
						<GetInTouchForm
							id={Number(id)}
							onSuccess={() => setFormSent(true)}
						/>
					)}
					{formSent && (
						<div className='text-center text-2xl text-white'>
							<p>
								{t([
									'Вашу заявку надіслано.\n З вами зконтактуються.\n Дякуємо!',
									"You're request has been sent! \n Thanks",
								])}
							</p>
							<button
								onClick={() => router.push('/')}
								className='mt-4 uppercase text-gold underline underline-offset-4 hover:text-gold-hover'
							>
								{t(['На головну', 'Homepage'])}
							</button>
						</div>
					)}
				</div>
			</LargeContainer>
			<Footer />
		</div>
	);
};

export default FormWrapper;
