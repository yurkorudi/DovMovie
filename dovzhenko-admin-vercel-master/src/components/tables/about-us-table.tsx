'use client';

import React, { useEffect, useTransition } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { z } from 'zod';
import DataTable from '@/components/table/DataTable';
import { useRouter } from 'next/navigation';
import { definedColumns } from '@/lib/table-columns/about';
import { ROUTER_PATHS } from '@/routes';

import ToastMessage from '@/components/toasts/toast-message';
import { useToast } from '@/components/ui/use-toast';
import { mappedDropdownMenuColumns } from '@/lib/map/dropdowns';
import { sortByOrder } from '@/lib/sort/data';
import { EDeleteMode } from '@/lib/types/common';

import DeleteModal from '@/components/modals/DeleteModal';
import { AboutSchema, AboutUsSchemaDB } from '@/schemas/about';
import {
	deleteAboutSlideAction,
	deleteManyAboutSlidesAction,
	getAllAboutUsSlides,
	updateAboutUsSlideOrder,
} from '@/actions/about-us';
import { handleSelectedItems } from '@/lib/state';
import { defineDeleteMode } from '@/lib/mode';

const StudiosTable = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [dialogOpened, setDialogOpened] = React.useState(false);
	const [slideId, setSlideId] = React.useState<string | null>(null);
	const [slideIds, setSlidesIds] = React.useState<string[] | null>(null);
	const [mode, setMode] = React.useState<EDeleteMode>(EDeleteMode.ONE);
	const [checkedAllCheckboxes, setCheckedAllCheckboxes] =
		React.useState<CheckedState>(false);

	const [selectedSlides, setSelectedSlides] = React.useState<string[]>([]);

	const [isPending, startTransition] = useTransition();

	const [slides, setSlides] = React.useState<z.infer<typeof AboutUsSchemaDB>>(
		[],
	);

	const sortAndSetSlides = (slides: z.infer<typeof AboutUsSchemaDB>) => {
		const currentSlides = sortByOrder(slides);

		setSlides(currentSlides);
	};

	const getAboutUsData = () => {
		startTransition(() => {
			getAllAboutUsSlides()
				.then((slides) => {
					sortAndSetSlides(slides);
				})
				.catch((error) => {
					console.error(error);
				});
		});
	};

	const handleDialog = (id: string | null) => {
		setDialogOpened(true);
		setSlideId(id);
		setMode(EDeleteMode.ONE);
	};

	const onDeleteSlide = () => {
		if (slideId) {
			startTransition(() => {
				deleteAboutSlideAction(slideId).then((response) => {
					toast({
						description: <ToastMessage data={response} />,
					});
					getAllAboutUsSlides()
						.then((slides) => {
							sortAndSetSlides(slides);
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
		setSlidesIds(ids);
		setMode(EDeleteMode.MANY);
	};

	const onDeleteCheckedSlides = () => {
		if (slideIds) {
			startTransition(() => {
				deleteManyAboutSlidesAction(slideIds).then((response) => {
					toast({
						description: <ToastMessage data={response} />,
					});
					getAllAboutUsSlides()
						.then((slides) => {
							sortAndSetSlides(slides);
							setSelectedSlides([]);
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

	const onDragItemEnd = async (slides: z.infer<typeof AboutSchema>[]) => {
		startTransition(() => {
			updateAboutUsSlideOrder(slides).then((response) => {
				toast({
					description: <ToastMessage data={response} />,
				});
			});
		});
	};

	const deleteAction = defineDeleteMode(
		mode,
		onDeleteSlide,
		onDeleteCheckedSlides,
	);

	const onEditHandler = (rowId: string) =>
		router.push(`${ROUTER_PATHS.EDIT_ABOUT_SLIDE}?slideId=${rowId}`);

	const handleCheckRow = (
		rowData: z.infer<typeof AboutSchema>,
		checked: CheckedState,
	) => {
		setSelectedSlides((prevState) => {
			return handleSelectedItems(rowData.id!, checked, prevState);
		});
	};

	const handleCheckAll = (allChecked: CheckedState) => {
		setCheckedAllCheckboxes(allChecked);
		const data = slides.map((slide) => slide.id!);
		setSelectedSlides(allChecked ? data : []);
	};

	useEffect(() => {
		getAboutUsData();
	}, []);

	return (
		<>
			<DeleteModal
				dialogOpened={dialogOpened}
				setDialogOpened={setDialogOpened}
				isPending={isPending}
				onDeleteItem={deleteAction}
				text='Ви впевнені що хочете видалити слайд(и)?'
			/>
			<DataTable
				editableColumns={mappedDropdownMenuColumns}
				columns={definedColumns({
					onCheckAll: handleCheckAll,
					onCheckRow: handleCheckRow,
					onEdit: (row) => onEditHandler(row.id!),
					onDelete: (id) => handleDialog(id),
				})}
				data={slides}
				isLoading={isPending}
				checkedAllCheckboxes={checkedAllCheckboxes}
				selectedItems={selectedSlides}
				onDeleteChecked={handleDeleteChecked}
				buttonRoute={ROUTER_PATHS.ADD_ABOUT_SLIDE}
				isDraggable
				emptyDataMessage='Немає активних слайдів'
				onDragEnd={onDragItemEnd}
				omitDropdownValues={['orderRow', 'Дія']}
			/>
		</>
	);
};

export default StudiosTable;
