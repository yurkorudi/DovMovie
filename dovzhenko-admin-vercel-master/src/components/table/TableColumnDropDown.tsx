import React from 'react';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Table } from '@tanstack/table-core';

const TableColumnDropDown = ({
	table,
	editableColumns,
	omitDropdownValues,
}: {
	table: Table<any>;
	editableColumns?: (name: string) => string;
	omitDropdownValues?: string[] | undefined;
}) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='ml-auto'>
					Колонки <ChevronDown className='ml-2 h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{table
					.getAllColumns()
					.filter((column) => column.getCanHide())
					.map((column) => {
						return omitDropdownValues?.includes(column.id) ? null : (
							<DropdownMenuCheckboxItem
								key={nanoid()}
								className='capitalize'
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{editableColumns ? editableColumns(column.id) : column.id}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default TableColumnDropDown;
