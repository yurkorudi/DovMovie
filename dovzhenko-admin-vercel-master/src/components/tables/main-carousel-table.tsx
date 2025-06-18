'use client';

import React, { useEffect, useTransition } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { z } from 'zod';
import { MainCarouselSlidesSchemaDB, SlideSchema } from '@/schemas/carousel';
import DataTable from '@/components/table/DataTable';
import {
	deleteMainCarouselSlide,
	deleteManyMainCarouselSlide,
	getMainCarouselSlides,
	updateMainCarouselSlideOrder,
} from '@/actions/carousel';
import { useRouter } from 'next/navigation';
import {
	definedColumns,
	definedColumnsArchive,
} from '@/lib/table-columns/carousel';
import { ROUTER_PATHS } from '@/routes';
import { createUrlSearchParams } from '@/lib/search-params';

import ToastMessage from '@/components/toasts/toast-message';
import { useToast } from '@/components/ui/use-toast';
import SectionHeader from '@/components/section-header';
import { mappedDropdownMenuColumns } from '@/lib/map/dropdowns';
import {
	sortByGTE,
	sortByLTE,
	sortByOrder,
	sortByStartTimeByAsc,
} from '@/lib/sort/data';
import { EDeleteMode } from '@/lib/types/common';
import DeleteModal from '@/components/modals/DeleteModal';
import { handleSelectedItems } from '@/lib/state';
import { defineDeleteMode } from '@/lib/mode';

const MainCarouselTable = () => {
	const router = useRouter();
	const { toast } = useToast();
	const [dialogOpened, setDialogOpened] = React.useState(false);
	const [slideId, setSlideId] = React.useState<string | null>(null);
	const [slideIds, setSlideIds] = React.useState<string[] | null>(null);
	const [mode, setMode] = React.useState<EDeleteMode>(EDeleteMode.ONE);
	const [checkedAllCheckboxes, setCheckedAllCheckboxes] =
		React.useState<CheckedState>(false);
	const [checkedAllCheckboxesArchive, setCheckedAllCheckboxesArchive] =
		React.useState<CheckedState>(false);

	const [selectedSlides, setSelectedSlides] = React.useState<string[]>([]);

	const [selectedSlidesArchive, setSelectedSlidesArchive] = React.useState<
		string[]
	>([]);

	const [isPending, startTransition] = useTransition();

	const [slides, setSlides] = React.useState<
		z.infer<typeof MainCarouselSlidesSchemaDB>
	>([]);

	const [archiveSlides, setArchiveSlides] = React.useState<
		z.infer<typeof MainCarouselSlidesSchemaDB>
	>([]);

	const createUrlSearchParamsAndRedirect = (data: Record<string, any>) => {
		const newData = { ...data };
		delete newData.createdBy;
		delete newData.createdById;

		router.push(
			`${ROUTER_PATHS.EDIT_MAIN_CAROUSEL_SLIDE}?${createUrlSearchParams(newData)}`,
		);
	};

	const sortAndSetSlides = (
		slides: z.infer<typeof MainCarouselSlidesSchemaDB>,
	) => {
		const currentSlides = sortByOrder(sortByGTE(slides));

		const archiveSlides = sortByStartTimeByAsc(sortByLTE(slides));

		setSlides(currentSlides);
		setArchiveSlides(archiveSlides);
	};

	const getSlides = () => {
		startTransition(() => {
			getMainCarouselSlides()
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
				deleteMainCarouselSlide(slideId).then((response) => {
					toast({
						description: <ToastMessage data={response} />,
					});
					getMainCarouselSlides()
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
		setSlideIds(ids);
		setMode(EDeleteMode.MANY);
	};

	const onDeleteCheckedSlides = () => {
		if (slideIds) {
			startTransition(() => {
				deleteManyMainCarouselSlide(slideIds).then((response) => {
					toast({
						description: <ToastMessage data={response} />,
					});
					getMainCarouselSlides()
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

	const onDragItemEnd = async (slides: z.infer<typeof SlideSchema>[]) => {
		startTransition(() => {
			updateMainCarouselSlideOrder(slides).then((response) => {
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

	const handleCheckRow = (
		rowData: z.infer<typeof SlideSchema>,
		checked: CheckedState,
	) => {
		setSelectedSlides((prevState) => {
			return handleSelectedItems(rowData.id!, checked, prevState);
		});
	};

	const handleCheckArchiveRow = (
		rowData: z.infer<typeof SlideSchema>,
		checked: CheckedState,
	) => {
		setSelectedSlidesArchive((prevState) => {
			return handleSelectedItems(rowData.id!, checked, prevState);
		});
	};

	useEffect(() => {
		getSlides();
	}, []);

	return (
		<>
			<DeleteModal
				dialogOpened={dialogOpened}
				setDialogOpened={setDialogOpened}
				isPending={isPending}
				onDeleteItem={deleteAction}
				text='Ви впевнені що хочете видалити слайд?'
			/>
			<SectionHeader className='mb-4 mt-5' title='Активні слайди' />
			<DataTable
				editableColumns={mappedDropdownMenuColumns}
				columns={definedColumns({
					onCheckAll: (allChecked) => {
						setCheckedAllCheckboxes(allChecked);
					},
					onCheckRow: handleCheckRow,
					onEdit: (row) => {
						createUrlSearchParamsAndRedirect(row);
					},
					onDelete: (id) => {
						handleDialog(id);
					},
				})}
				data={slides}
				isLoading={isPending}
				checkedAllCheckboxes={checkedAllCheckboxes}
				selectedItems={selectedSlides}
				onDeleteChecked={handleDeleteChecked}
				buttonRoute={ROUTER_PATHS.ADD_MAIN_CAROUSEL_SLIDE}
				isDraggable
				emptyDataMessage='Немає активних слайдів'
				onDragEnd={onDragItemEnd}
				omitDropdownValues={['orderRow', 'Дія']}
			/>
			<SectionHeader className='mb-4 mt-14' title='Архів слайдів' />
			<DataTable
				editableColumns={mappedDropdownMenuColumns}
				columns={definedColumnsArchive({
					onCheckAll: (allChecked) => {
						setCheckedAllCheckboxesArchive(allChecked);
					},
					onCheckRow: handleCheckArchiveRow,
					onEdit: (row) => {
						createUrlSearchParamsAndRedirect(row);
					},
					onDelete: (id) => {
						handleDialog(id);
					},
				})}
				data={archiveSlides}
				isLoading={isPending}
				checkedAllCheckboxes={checkedAllCheckboxesArchive}
				selectedItems={selectedSlidesArchive}
				searchable
				emptyDataMessage='Немає архівних слайдів'
			/>
		</>
	);
};

export default MainCarouselTable;
