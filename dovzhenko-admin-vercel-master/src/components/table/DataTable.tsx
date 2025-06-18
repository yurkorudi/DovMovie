'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	Row,
	SortingState,
	useReactTable,
	VisibilityState,
	PaginationState,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { nanoid } from 'nanoid';

import React, { useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Grip } from 'lucide-react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dynamic from 'next/dynamic';
import useSkeletonState from '@/hooks/use-skeleton-state';
import TableColumnDropDown from '@/components/table/TableColumnDropDown';
import TableSearchInput from '@/components/table/TableSearchInput';
import AdditionalButton from '@/components/table/AdditionalButton';
import TableHeaderContent from '@/components/table/TableHeaderContent';
import TableDeleteButton from '@/components/table/TableDeleteButton';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[] | null | undefined;
	isLoading?: boolean;
}

const DraggableRow: React.FC<{
	row: Row<any>;
	reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
	isDraggable?: boolean;
}> = ({ row, reorderRow, isDraggable }) => {
	const [, dropRef] = useDrop({
		accept: 'row',
		drop: (draggedRow: Row<any>) => reorderRow(draggedRow.index, row.index),
	});

	const [, dragRef, previewRef] = useDrag({
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		item: () => row,
		type: 'row',
	});

	return (
		<TableRow
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//  @ts-expect-error
			ref={previewRef}
			className='hover:bg-muted/50'
		>
			{row.getVisibleCells().map((cell: any, index) => {
				return index === 1 && isDraggable ? (
					/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/
					/*@ts-expect-error*/
					<TableCell ref={dropRef} key={nanoid()}>
						<Button
							variant='ghost'
							ref={dragRef as any}
							className='m-0 cursor-move p-0 hover:bg-transparent'
						>
							<Grip />
						</Button>
					</TableCell>
				) : (
					<TableCell key={cell.id}>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				);
			})}
		</TableRow>
	);
};

const DataTable = ({
	columns,
	data,
	isLoading,
	checkedAllCheckboxes,
	selectedItems,
	editableColumns,
	className,
	searchable,
	buttonRoute,
	onDeleteChecked,
	isDraggable,
	emptyDataMessage,
	onDragEnd,
	omitDropdownValues,
	searchField,
	hasPagination,
}: DataTableProps<any, any> & {
	checkedAllCheckboxes?: CheckedState;
	selectedItems?: string[];
	editableColumns?: (name: string) => string;
	className?: string;
	searchable?: boolean;
	buttonRoute?: string;
	emptyDataMessage?: string;
	onDeleteChecked?: (slides: string[]) => void;
	isDraggable?: boolean;
	hasPagination?: boolean;
	onDragEnd?: (data: any[]) => void;
	omitDropdownValues?: string[] | undefined;
	searchField?: string | undefined;
}) => {
	const [dataList, setData] = React.useState<any[] | null | undefined>(data);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const showSkeleton = useSkeletonState(dataList);
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const table = useReactTable({
		data: dataList!,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
	});

	const renderTableContent = useCallback(() => {
		const array = Array.from({ length: 3 }, (_, i) => i);

		// If loading
		if (isLoading || showSkeleton) {
			return array.map(() => (
				<TableRow key={nanoid()}>
					{columns.map(() => (
						<TableCell key={nanoid()}>
							<Skeleton className='block h-[30px] w-full rounded' />
						</TableCell>
					))}
				</TableRow>
			));
		}

		// If not loading and data is empty
		if (!data?.length && !isLoading && !showSkeleton) {
			return (
				<TableRow>
					<TableCell colSpan={columns.length} className='text-center'>
						{emptyDataMessage || 'Немає данних'}
					</TableCell>
				</TableRow>
			);
		}

		// If not loading and data is not empty
		if (!isLoading && data?.length) {
			return table
				.getRowModel()
				.rows.map((row) => (
					<DraggableRow
						key={row.id}
						row={row}
						reorderRow={reorderRow}
						isDraggable={isDraggable}
					/>
				));
		}
	}, [data, isLoading, showSkeleton]);

	const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
		if (Array.isArray(dataList)) {
			dataList.splice(
				targetRowIndex,
				0,
				dataList.splice(draggedRowIndex, 1)[0] as any,
			);
			setData([...dataList]);

			if (onDragEnd) {
				onDragEnd(dataList);
			}
		}
	};

	const onDeleteButtonHandle = () => {
		if (onDeleteChecked && selectedItems?.length) {
			onDeleteChecked(selectedItems);
		}
	};

	useEffect(() => {
		setData(data);
	}, [data]);

	return (
		<DndProvider backend={HTML5Backend}>
			<div className={className}>
				<div className='flex items-center gap-x-4 py-4'>
					<TableSearchInput
						searchable={searchable}
						table={table}
						placeholder='Фільтруваня по заголовку...'
						searchField={searchField}
					/>
					<TableColumnDropDown
						table={table}
						editableColumns={editableColumns}
						omitDropdownValues={omitDropdownValues}
					/>
					<AdditionalButton route={buttonRoute} />
					<TableDeleteButton
						checkedAllCheckboxes={checkedAllCheckboxes}
						selectedItems={selectedItems}
						onDeleteButtonHandle={onDeleteButtonHandle}
					/>
				</div>
				<div className='overflow-hidden rounded-md border'>
					<Table className='dark:bg-background'>
						<TableHeader className='bg-slate-100'>
							<TableHeaderContent table={table} />
						</TableHeader>
						<TableBody>
							{/*{table.getRowModel().rows?.length ? (*/}
							{renderTableContent()}
						</TableBody>
					</Table>
				</div>
				<div
					className={cn(
						{
							'flex justify-end': hasPagination,
							hidden: !hasPagination,
						},
						'mt-4 pb-8',
					)}
				>
					<div className='flex gap-x-4'>
						<button
							className='rounded border px-4 py-1'
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							title={
								!table.getCanPreviousPage()
									? 'Кнопка вимкнена'
									: 'Попередня сторінка'
							}
						>
							{'<'}
						</button>
						<button
							className='rounded border px-4 py-1'
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							title={
								!table.getCanNextPage()
									? 'Кнопка вимкнена'
									: 'Наступна сторінка'
							}
						>
							{'>'}
						</button>
					</div>
				</div>
			</div>
		</DndProvider>
	);
};

export default dynamic(() => Promise.resolve(DataTable), { ssr: false });
