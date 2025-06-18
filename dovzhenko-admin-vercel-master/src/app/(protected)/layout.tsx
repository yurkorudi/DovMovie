import { PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';
import MainContent from '@/components/main-content';
import PreHeader from '@/app/(protected)/_components/pre-header';
import ScreenLoader from '@/components/loader/screen-loader';
import ProtectedWrapper from '@/app/(protected)/_components/protected-wrapper';
import Sidebar from '@/app/(protected)/_components/sidebar';
import Header from '@/app/(protected)/_components/header';
import BlurredScreen from '@/components/blurred-screen';

const ProtectedLayout = ({ children }: PropsWithChildren) => {
	return (
		<ProtectedWrapper>
			<SessionProvider>
				<ScreenLoader />
				{/* Start Navigation */}
				<BlurredScreen />
				<Header />
				{/* End Navigation */}

				{/* Start Main Content*/}
				<Sidebar />
				<MainContent>
					<PreHeader />
					{/*<Navbar />*/}
					{children}
				</MainContent>
				{/*End Main Content*/}
			</SessionProvider>
		</ProtectedWrapper>
	);
};

export default ProtectedLayout;
