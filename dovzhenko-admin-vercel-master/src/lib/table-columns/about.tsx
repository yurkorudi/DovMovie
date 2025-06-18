import { CheckedState } from '@radix-ui/react-checkbox';
import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { AboutSchema } from '@/schemas/about';

export const definedColumns = ({
	onCheckAll,
	onCheckRow,
	onEdit,
	onDelete,
}: {
	onCheckAll: (studiosState: CheckedState) => void;
	onCheckRow: (row: z.infer<typeof AboutSchema>, value: CheckedState) => void;
	onEdit: (row: z.infer<typeof AboutSchema>) => void;
	onDelete: (id: string) => void;
}) => {
	const columns: ColumnDef<z.infer<typeof AboutSchema>>[] = [
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
			id: 'orderRow',
			header: 'Порядок',
		},
		{
			header: 'Зображення',
			accessorKey: 'image',
			cell: ({ row }) => {
				return (
					<Image
						src={row?.original?.image}
						alt='studios image'
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
			header: 'Зображення(друге)',
			accessorKey: 'secondImage',
			cell: ({ row }) => {
				return (
					<Image
						src={row?.original?.secondImage}
						alt='studios image'
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
			header: "Ім'я",
			accessorKey: 'name',
			cell: ({ row }) => {
				return <span>{row?.original?.name}</span>;
			},
		},
		{
			header: "Ім'я(Eng)",
			accessorKey: 'nameEng',
			cell: ({ row }) => {
				return <span>{row.original.nameEng}</span>;
			},
		},
		{
			header: 'Прізвище',
			accessorKey: 'surname',
			cell: ({ row }) => {
				return <span>{row?.original?.surname}</span>;
			},
		},
		{
			header: 'Прізвище(Eng)',
			accessorKey: 'surnameEng',
			cell: ({ row }) => {
				return <span>{row.original.surnameEng}</span>;
			},
		},
		{
			header: 'Посада',
			accessorKey: 'position',
			cell: ({ row }) => {
				return (
					<span className='inline-block w-[200px]'>
						{row?.original?.position}
					</span>
				);
			},
		},
		{
			header: 'Посада(Eng)',
			accessorKey: 'positionEng',
			cell: ({ row }) => {
				return <div className='w-[200px]'>{row.original.positionEng}</div>;
			},
		},
		{
			header: 'Автор',
			accessorKey: 'createdBy',
			cell: ({ row }) => {
				return (
					<span className='inline-block w-[200px]'>
						{row.original?.createdBy?.name}
					</span>
				);
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
