import React from 'react';
import { TableHead, TableRow } from '@/components/ui/table';
import { nanoid } from 'nanoid';
import { flexRender } from '@tanstack/react-table';
import { Table } from '@tanstack/table-core';

const TableHeaderContent = ({ table }: { table: Table<any> }) => {
	return table.getHeaderGroups().map((headerGroup) => (
		<TableRow key={nanoid()}>
			{headerGroup.headers.map((header) => {
				return (
					<TableHead key={nanoid()}>
						{header.isPlaceholder
							? null
							: flexRender(header.column.columnDef.header, header.getContext())}
					</TableHead>
				);
			})}
		</TableRow>
	));
};

export default TableHeaderContent;
