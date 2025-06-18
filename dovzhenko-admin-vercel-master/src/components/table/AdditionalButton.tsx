import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const AdditionalButton = ({ route }: { route?: string }) => {
	if (!route?.length) return null;

	const router = useRouter();

	return <Button onClick={() => router.push(route)}>Додати</Button>;
};

export default AdditionalButton;
