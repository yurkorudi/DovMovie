import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import Header from '@/components/auth/header';
import BackButton from '@/components/auth/back-button';

const ErrorCard = () => {
	return (
		<Card className='w-[400px] shadow-md'>
			<CardHeader>
				<Header label={'Something went wrong'} />
			</CardHeader>
			<CardFooter>
				<BackButton href='/auth/login' label='Back to login' />
			</CardFooter>
		</Card>
	);
};

export default ErrorCard;
