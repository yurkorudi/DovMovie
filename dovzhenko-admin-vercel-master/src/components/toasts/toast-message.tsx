import React from 'react';
import { Angry, Verified } from 'lucide-react';

const ToastMessage = ({
	data,
}: {
	data: { message: string; success: boolean };
}) => {
	return (
		<div className='flex items-center justify-start'>
			{data?.success && <Verified className='h-6 w-6 text-green-500' />}
			{!data?.success && <Angry className='h-6 w-6 text-red-500' />}
			<span className='ml-2 dark:text-white'>{data?.message}</span>
		</div>
	);
};

export default ToastMessage;
