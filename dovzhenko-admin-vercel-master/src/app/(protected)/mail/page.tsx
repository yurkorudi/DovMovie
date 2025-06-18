import React from 'react';
import { getMessages } from '@/actions/mail';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { nanoid } from 'nanoid';
import moment from 'moment';
import { clsx } from 'clsx';

const Page = async () => {
	const data = await getMessages();

	return (
		<div>
			{data.map((msg, index) => (
				<Card key={nanoid()} className={clsx({ 'mt-4': index !== 0 })}>
					<CardHeader>
						<div className='flex justify-between '>
							<p>
								<span className='font-bold'>{msg.name}:</span> {msg.phone}
							</p>
							<small>{moment(msg.createdAt).format('DD/MM/YYYY hh:mm')}</small>
						</div>
					</CardHeader>
					<CardContent>{msg.message}</CardContent>
				</Card>
			))}
		</div>
	);
};

export default Page;
