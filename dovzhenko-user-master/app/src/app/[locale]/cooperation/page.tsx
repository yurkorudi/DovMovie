import Header from '@/components/cooperation/header';
import { TLocale } from '@/lib/types/locales';
import LargeContainer from '@/components/containers/large-container';
import Footer from '@/components/footer/footer';
import HallList from '@/components/cooperation/hall-list';

const CooperationPage = ({ params: { locale } }: { params: TLocale }) => {
	return (
		<div className='flex min-h-[calc(100dvh-70px)] flex-col'>
			<Header locale={locale} />
			<div
				style={{
					backgroundImage:
						'linear-gradient(rgb(37, 20, 71) 0%, rgba(43, 29, 112, 0.4) 60%, rgba(37, 20, 71, 0.7) 72.4%, rgb(37, 20, 71) 100%), url("/static/images/cooperation/background.webp")',
				}}
				className='flex flex-shrink-0 flex-grow flex-col bg-cover bg-center bg-no-repeat'
			>
				<LargeContainer className='flex flex-shrink-0 flex-grow flex-col'>
					<div className='mx-auto max-w-[1110px]'>
						<HallList />
					</div>
				</LargeContainer>
				<Footer />
			</div>
		</div>
	);
};

export default CooperationPage;
