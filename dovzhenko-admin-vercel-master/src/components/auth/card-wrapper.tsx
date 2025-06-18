'use client';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import Header from '@/components/auth/header';
import Social from '@/components/auth/social';
import { PropsWithChildren } from 'react';

interface CardWrapperProps {
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocials?: boolean;
}

const CardWrapper = ({
	headerLabel,
	backButtonLabel,
	backButtonHref,
	showSocials = false,
	children,
}: PropsWithChildren<CardWrapperProps>) => {
	console.log(backButtonHref, backButtonLabel);

	return (
		<Card className='flex-basis-0 light:shadow-lg mx-auto max-w-[400px] flex-shrink flex-grow border'>
			<CardHeader>
				<Header label={headerLabel} />
			</CardHeader>
			<CardContent>{children}</CardContent>
			{showSocials && (
				<CardFooter>
					<Social />
				</CardFooter>
			)}
			{/*<CardFooter>*/}
			{/*	<BackButton href={backButtonHref} label={backButtonLabel} />*/}
			{/*</CardFooter>*/}
		</Card>
	);
};

export default CardWrapper;
