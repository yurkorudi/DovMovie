import { CheckedState } from '@radix-ui/react-checkbox';
import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { EventSchemaDB } from '@/schemas/event';

export const eventDefinedColumns = ({
	onCheckAll,
	onCheckRow,
	onEdit,
	onDelete,
}: {
	onCheckAll: (slides: CheckedState) => void;
	onCheckRow: (row: z.infer<typeof EventSchemaDB>, value: CheckedState) => void;
	onEdit: (row: z.infer<typeof EventSchemaDB>) => void;
	onDelete: (id: string) => void;
}) => {
	const columns: ColumnDef<z.infer<typeof EventSchemaDB>>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) => {
						table.toggleAllPageRowsSelected(!!value);
						onCheckAll(value);
					}}
					aria-label='Select all'
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => {
						row.toggleSelected(!!value);
						onCheckRow(row.original, value);
					}}
					aria-label='Select row'
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			header: 'Зображення',
			accessorKey: 'image',
			cell: ({ row }) => {
				return (
					<Image
						src={row?.original?.backgroundImage}
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
			id: 'titleEng',
			header: 'Заголовок(Eng)',
			cell: ({ row }) => {
				return row.original.titleEng;
			},
		},
		{
			header: 'Дата',
			accessorKey: 'startTime',
			cell: ({ row }) => {
				return moment(row?.original?.startTime).format('DD/MM/YYYY');
			},
		},
		{
			header: 'Опис події',
			accessorKey: 'cardDescription',
			cell: ({ row }) => {
				return <div className='w-[300px]'>{row.original.cardDescription}</div>;
			},
		},
		{
			header: 'Опис події(Eng)',
			accessorKey: 'cardDescriptionEng',
			cell: ({ row }) => {
				return (
					<div className='w-[300px]'>{row.original.cardDescriptionEng}</div>
				);
			},
		},
		{
			header: 'Посилання',
			accessorKey: 'link',
		},
		{
			header: 'Тип',
			accessorKey: 'typeImage',
			cell: ({ row }) => {
				return <Badge>{row.original.typeImage}</Badge>;
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
