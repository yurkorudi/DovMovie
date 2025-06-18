import React from 'react';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/table-core';

const TableSearchInput = ({
	searchable,
	table,
	placeholder,
	searchField = 'title',
}: {
	searchable?: boolean;
	table: Table<any>;
	placeholder: string;
	searchField?: string | undefined;
}) => {
	return searchable ? (
		<Input
			placeholder={placeholder}
			value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ''}
			onChange={(event) =>
				table.getColumn(searchField)?.setFilterValue(event.target.value)
			}
			className='max-w-sm [&::placeholder]:text-slate-300'
		/>
	) : null;
};

export default TableSearchInput;
