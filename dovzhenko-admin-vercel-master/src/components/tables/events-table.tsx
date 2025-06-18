'use client';
import SectionHeader from '@/components/section-header';
import DataTable from '@/components/table/DataTable';
import { mappedDropdownMenuColumns } from '@/lib/map/dropdowns';
import { ROUTER_PATHS } from '@/routes';
import React, { useEffect, useTransition } from 'react';
import { z } from 'zod';
import { EventSchemaDB, MainEventSchemaDB } from '@/schemas/event';
import ToastMessage from '@/components/toasts/toast-message';
import { useToast } from '@/components/ui/use-toast';
import { sortByGTE, sortByLTE, sortByStartTimeByAsc } from '@/lib/sort/data';
import {
	deleteEventAction,
	deleteManyEventsAction,
	getAllEvents,
} from '@/actions/events';
import { EDeleteMode } from '@/lib/types/common';
import { eventDefinedColumns } from '@/lib/table-columns/events';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DeleteModal from '@/components/modals/DeleteModal';
import { handleSelectedItems } from '@/lib/state';
import { defineDeleteMode } from '@/lib/mode';

const EventsTable = ({
	eventsList,
}: {
	eventsList: z.infer<typeof MainEventSchemaDB>;
}) => {
	const router = useRouter();
	const [dialogOpened, setDialogOpened] = React.useState(false);
	const [isPending, startTransition] = useTransition();
	const [eventId, setEventId] = React.useState<string | null>(null);
	const [eventIds, setEventIds] = React.useState<string[] | null>(null);
	const [mode, setMode] = React.useState<EDeleteMode>(EDeleteMode.ONE);
	const [checkedAllCheckboxes, setCheckedAllCheckboxes] =
		React.useState<CheckedState>(false);
	const [checkedAllCheckboxesArchive, setCheckedAllCheckboxesArchive] =
		React.useState<CheckedState>(false);
	const { toast } = useToast();

	const [selectedEvents, setSelectedEvents] = React.useState<string[]>([]);

	const [selectedEventsArchive, setSelectedEventsArchive] = React.useState<
		string[]
	>([]);

	const [events, setEvents] =
		React.useState<z.infer<typeof MainEventSchemaDB>>(eventsList);

	const [archiveEvents, setArchiveEvents] = React.useState<
		z.infer<typeof MainEventSchemaDB>
	>([]);

	const sortAndSetEvent = (events: z.infer<typeof MainEventSchemaDB>) => {
		const currentSlides = sortByStartTimeByAsc(sortByGTE(events));

		const archiveSlides = sortByStartTimeByAsc(sortByLTE(events));

		setEvents(currentSlides);
		setArchiveEvents(archiveSlides);
	};

	const onDeleteEvent = () => {
		if (eventId) {
			startTransition(() => {
				deleteEventAction(eventId).then((response) => {
					toast({
						description: <ToastMessage data={response} />,
					});
					getAllEvents()
						.then((events) => {
							sortAndSetEvent(events);
						})
						.catch((error) => {
							console.error(error);
						});
				});
			});
		}

		setDialogOpened((prev) => !prev);
	};

	const onDeleteCheckedSlides = () => {
		if (eventIds) {
			startTransition(() => {
				deleteManyEventsAction(eventIds).then((response) => {
					toast({
						description: <ToastMessage data={response} />,
					});
					getAllEvents()
						.then((events) => {
							sortAndSetEvent(events);
							setSelectedEvents([]);
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

	const handleDialog = (id: string | null) => {
		setDialogOpened(true);
		setEventId(id);
		setMode(EDeleteMode.ONE);
	};

	const handleDeleteChecked = (ids: string[]) => {
		setDialogOpened(true);
		setEventIds(ids);
		setMode(EDeleteMode.MANY);
	};

	const deleteAction = defineDeleteMode(
		mode,
		onDeleteEvent,
		onDeleteCheckedSlides,
	);

	const handleCheckRow = (
		rowData: z.infer<typeof EventSchemaDB>,
		checked: CheckedState,
	) => {
		setSelectedEvents((prevState) => {
			return handleSelectedItems(rowData.id!, checked, prevState);
		});
	};

	const handleCheckArchiveRow = (
		rowData: z.infer<typeof EventSchemaDB>,
		checked: CheckedState,
	) => {
		setSelectedEventsArchive((prevState) => {
			return handleSelectedItems(rowData.id!, checked, prevState);
		});
	};

	const handleCheckAll = (allChecked: CheckedState) => {
		setCheckedAllCheckboxes(allChecked);
		const data = events.map((event) => event.id!);
		setSelectedEvents(allChecked ? data : []);
	};

	const handleCheckAllArchive = (allChecked: CheckedState) => {
		setCheckedAllCheckboxesArchive(allChecked);
		const data = events.map((event) => event.id!);
		setSelectedEventsArchive(allChecked ? data : []);
	};

	const handleOnEdit = (rowId: string) =>
		router.push(`${ROUTER_PATHS.EDIT_EVENT}?eventId=${rowId}`);

	useEffect(() => {
		// Update events list on server component
		router.refresh();
	}, []);

	useEffect(() => {
		sortAndSetEvent(eventsList);
	}, [eventsList]);

	return (
		<>
			<DeleteModal
				dialogOpened={dialogOpened}
				setDialogOpened={setDialogOpened}
				isPending={isPending}
				onDeleteItem={deleteAction}
				text='Ви впевнені що хочете видалити евент?'
			/>
			<SectionHeader className='mb-4 mt-5' title='Активні події' />
			<DataTable
				editableColumns={mappedDropdownMenuColumns}
				columns={eventDefinedColumns({
					onCheckAll: handleCheckAll,
					onCheckRow: handleCheckRow,
					onEdit: (row) => handleOnEdit(row.id!),
					onDelete: (id) => handleDialog(id),
				})}
				data={events}
				isLoading={isPending}
				checkedAllCheckboxes={checkedAllCheckboxes}
				selectedItems={selectedEvents}
				onDeleteChecked={handleDeleteChecked}
				buttonRoute={ROUTER_PATHS.ADD_EVENT}
				emptyDataMessage='Немає активних подій'
				omitDropdownValues={['orderRow', 'Дія']}
			/>
			<SectionHeader className='mb-4 mt-14' title='Архів подій' />
			<DataTable
				editableColumns={mappedDropdownMenuColumns}
				columns={eventDefinedColumns({
					onCheckAll: handleCheckAllArchive,
					onCheckRow: handleCheckArchiveRow,
					onEdit: (row) => handleOnEdit(row.id!),
					onDelete: (id) => handleDialog(id),
				})}
				data={archiveEvents}
				isLoading={isPending}
				checkedAllCheckboxes={checkedAllCheckboxesArchive}
				selectedItems={selectedEventsArchive}
				searchable
				emptyDataMessage='Немає архівних подій'
			/>
		</>
	);
};

export default dynamic(() => Promise.resolve(EventsTable), {
	ssr: false,
});
