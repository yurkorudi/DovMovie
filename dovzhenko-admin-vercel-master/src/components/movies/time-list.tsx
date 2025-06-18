'use client';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { nanoid } from 'nanoid';
import moment from 'moment';
import 'moment/locale/uk';
import { Pencil, X } from 'lucide-react';
import { DateListType } from '@/lib/types/common';
moment().locale('uk');

const TimeList = ({
	data,
	onEdit,
	onDelete,
}: {
	data: DateListType[];
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}) => {
	return (
		<div className='grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'>
			{data.map((item) => (
				<Card key={nanoid()} className='p-0 shadow-md'>
					<CardContent className='p-0'>
						<CardTitle className='rounded-md bg-primary px-4 py-2'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-white'>
									{moment(item.date).format('DD MMMM YYYY(ddd)')}
								</span>
								<div className='flex gap-x-2'>
									<button className='group' onClick={() => onEdit(item.id)}>
										<Pencil className='h-4 w-4 text-slate-400 group-hover:text-yellow-400' />
									</button>
									<button className='group' onClick={() => onDelete(item.id)}>
										<X className='h-5 w-5 text-slate-400 group-hover:text-red-400' />
									</button>
								</div>
							</div>
						</CardTitle>
						<div className='grid grid-cols-1 px-4 py-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
							{item.time.map((time) => (
								<span className='text-bold mr-1 text-sm' key={nanoid()}>
									{time};
								</span>
							))}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default TimeList;
