import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { MovieSchema } from '@/schemas/movie';
import { showtimeToDateList } from '@/lib/map/movie';
import moment from 'moment';

export const moviesDefinedColumns = ({
	onEdit,
	onDelete,
}: {
	onEdit: (row: z.infer<typeof MovieSchema>) => void;
	onDelete: (id: string) => void;
}) => {
	const columns: ColumnDef<z.infer<typeof MovieSchema>>[] = [
		{
			header: 'Зображення',
			accessorKey: 'image',
			cell: ({ row }) => {
				return (
					<Image
						src={row?.original?.poster}
						alt='slide'
						width={80}
						height={80}
						className='mx-auto max-h-[80px] min-h-[80px] object-cover'
						unoptimized
						priority
					/>
				);
			},
		},
		{
			id: 'title',
			header: 'Заголовок',
			cell: ({ row }) => {
				return row.original.title;
			},
		},
		{
			id: 'Date',
			header: 'Дата',
			cell: ({ row }) => {
				const showtimes = showtimeToDateList(row.original.showtimes!);
				const sorted = showtimes.sort(
					(a, b) => a.date.getTime() - b.date.getTime(),
				);
				const startDate = moment(sorted[0]?.date).format('DD.MM.YYYY');
				const endDate = moment(sorted[sorted.length - 1]?.date).format(
					'DD.MM.YYYY',
				);

				return (
					<div>
						{startDate} - {endDate}
					</div>
				);
			},
		},
		{
			header: 'Автор',
			accessorKey: 'createdBy',
			cell: ({ row }) => {
				return <span>{row.original?.createdBy?.name}</span>;
			},
		},
		{
			header: 'Дія',
			accessorKey: '',
			cell: ({ row }) => {
				return (
					<DropdownMenu>
						<DropdownMenuTrigger className='focus:outline-none'>
							<EllipsisVertical className='w-[14px]' />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem onClick={() => onEdit(row.original)}>
								<Pencil className='mr-2 w-[14px]' />
								<span>Редагувати</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onDelete(row.original.id!)}>
								<Trash2 className='mr-2 w-[14px]' />
								<span>Видалити</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return columns;
};
