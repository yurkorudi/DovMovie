import LargeContainer from '@/components/containers/large-container';
import Footer from '@/components/footer/footer';
import { PropsWithChildren } from 'react';

const MoviePageWrapper = ({ children }: PropsWithChildren) => {
	return (
		<div
			style={{
				backgroundImage:
					'linear-gradient(rgb(37, 20, 71) 0%, rgba(43, 29, 112, 0.4) 60%, rgba(37, 20, 71, 0.7) 72.4%, rgb(37, 20, 71) 100%), url("/static/images/cooperation/background.webp")',
			}}
			className='flex min-h-[calc(100dvh-70px)] flex-col bg-cover bg-center bg-no-repeat'
		>
			<LargeContainer className='flex flex-shrink-0 flex-grow flex-col'>
				<div className='mt-8'>{children}</div>
			</LargeContainer>
			<Footer className='mt-4' />
		</div>
	);
};

export default MoviePageWrapper;
