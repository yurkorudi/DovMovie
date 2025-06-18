'use client';

import React, { useEffect, useTransition } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { z } from 'zod';
import DataTable from '@/components/table/DataTable';
import { useRouter } from 'next/navigation';
import { definedColumns } from '@/lib/table-columns/studios';
import { ROUTER_PATHS } from '@/routes';

import ToastMessage from '@/components/toasts/toast-message';
import { useToast } from '@/components/ui/use-toast';
import { mappedDropdownMenuColumns } from '@/lib/map/dropdowns';
import { sortByOrder } from '@/lib/sort/data';
import { EDeleteMode } from '@/lib/types/common';
import { StudioSchema, StudiosSchemaDB } from '@/schemas/studio';
import {
	deleteManyStudios,
	deleteStudio,
	getStudios,
	updateStudiosOrder,
} from '@/actions/studios';
import DeleteModal from '@/components/modals/DeleteModal';
import { handleSelectedItems } from '@/lib/state';
import { defineDeleteMode } from '@/lib/mode';

const StudiosTable = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [dialogOpened, setDialogOpened] = React.useState(false);
	const [studioId, setStudioId] = React.useState<string | null>(null);
	const [studioIds, setStudioIds] = React.useState<string[] | null>(null);
	const [mode, setMode] = React.useState<EDeleteMode>(EDeleteMode.ONE);
	const [checkedAllCheckboxes, setCheckedAllCheckboxes] =
		React.useState<CheckedState>(false);

	const [selectedStudios, setSelectedStudios] = React.useState<string[]>([]);

	const [isPending, startTransition] = useTransition();

	const [studios, setStudios] = React.useState<z.infer<typeof StudiosSchemaDB>>(
		[],
	);

	const sortAndSetStudios = (studios: z.infer<typeof StudiosSchemaDB>) => {
		const currentStudios = sortByOrder(studios);

		setStudios(currentStudios);
	};

	const getStudiosData = () => {
		startTransition(() => {
			getStudios()
				.then((studios) => {
					sortAndSetStudios(studios);
				})
				.catch((error) => {
					console.error(error);
				});
		});
	};

	const handleDialog = (id: string | null) => {
		setDialogOpened(true);
		setStudioId(id);
		setMode(EDeleteMode.ONE);
	};

	const onDeleteStudio = () => {
		if (studioId) {
			startTransition(() => {
				deleteStudio(studioId).then((response) => {
					toast({
						description: <ToastMessage data={response} />,
					});
					getStudios()
						.then((studios) => {
							sortAndSetStudios(studios);
						})
						.catch((error) => {
							console.error(error);
						});
				});
			});
		}

		setDialogOpened((prev) => !prev);
	};

	const handleDeleteChecked = (ids: string[]) => {
		setDialogOpened(true);
		setStudioIds(ids);
		setMode(EDeleteMode.MANY);
	};

	const onDeleteCheckedStudios = () => {
		if (studioIds) {
			startTransition(() => {
				deleteManyStudios(studioIds).then((response) => {
					toast({
						description: <ToastMessage data={response} />,
					});
					getStudios()
						.then((studios) => {
							sortAndSetStudios(studios);
							setSelectedStudios([]);
							setCheckedAllCheckboxes(false);
						})
						.catch((error) => {
							console.error(error);
						});
				});
			});
			setDialogOpened((prev) => !prev);
		}
	};

	const onDragItemEnd = async (studios: z.infer<typeof StudioSchema>[]) => {
		startTransition(() => {
			updateStudiosOrder(studios).then((response) => {
				toast({
					description: <ToastMessage data={response} />,
				});
			});
		});
	};

	const deleteAction = defineDeleteMode(
		mode,
		onDeleteStudio,
		onDeleteCheckedStudios,
	);

	const onEditHandler = (rowId: string) =>
		router.push(`${ROUTER_PATHS.EDIT_STUDIO}?studioId=${rowId}`);

	const handleCheckRow = (
		rowData: z.infer<typeof StudioSchema>,
		checked: CheckedState,
	) => {
		setSelectedStudios((prevState) => {
			return handleSelectedItems(rowData.id!, checked, prevState);
		});
	};

	const handleCheckAll = (allChecked: CheckedState) => {
		setCheckedAllCheckboxes(allChecked);
		const data = studios.map((studio) => studio.id!);
		setSelectedStudios(allChecked ? data : []);
	};

	useEffect(() => {
		getStudiosData();
	}, []);

	return (
		<>
			<DeleteModal
				dialogOpened={dialogOpened}
				setDialogOpened={setDialogOpened}
				isPending={isPending}
				onDeleteItem={deleteAction}
				text='Ви впевнені що хочете видалити студію?'
			/>
			<DataTable
				editableColumns={mappedDropdownMenuColumns}
				columns={definedColumns({
					onCheckAll: handleCheckAll,
					onCheckRow: handleCheckRow,
					onEdit: (row) => onEditHandler(row.id!),
					onDelete: handleDialog,
				})}
				data={studios}
				isLoading={isPending}
				checkedAllCheckboxes={checkedAllCheckboxes}
				selectedItems={selectedStudios}
				onDeleteChecked={handleDeleteChecked}
				buttonRoute={ROUTER_PATHS.ADD_STUDIO}
				isDraggable
				emptyDataMessage='Немає активних студій'
				onDragEnd={onDragItemEnd}
				omitDropdownValues={['orderRow', 'Дія']}
			/>
		</>
	);
};

export default StudiosTable;
