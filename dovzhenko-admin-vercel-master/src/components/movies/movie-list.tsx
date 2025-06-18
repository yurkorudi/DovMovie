'use client';
import { MovieResponseSchema } from '@/schemas/movie';
import { z } from 'zod';
import SectionHeader from '@/components/section-header';
import React, { useEffect, useState, useTransition } from 'react';
import DataTable from '@/components/table/DataTable';
import { mappedDropdownMenuColumns } from '@/lib/map/dropdowns';
import { ROUTER_PATHS } from '@/routes';
import { moviesDefinedColumns } from '@/lib/table-columns/movies';
import { useRouter } from 'next/navigation';
import DeleteModal from '@/components/modals/DeleteModal';
import ToastMessage from '@/components/toasts/toast-message';
import { useToast } from '@/components/ui/use-toast';
import { deleteMovie } from '@/actions/movie';

const MovieList = ({
	movies,
	archiveMovies,
}: {
	movies: z.infer<typeof MovieResponseSchema>[];
	archiveMovies: z.infer<typeof MovieResponseSchema>[];
}) => {
	const [movieId, setMovieId] = useState<string | null>(null);
	const [dialogOpened, setDialogOpened] = useState(false);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const { toast } = useToast();

	const handleDialog = (id: string | null) => {
		setDialogOpened(true);
		setMovieId(id);
	};

	const onDeleteEvent = () => {
		if (movieId) {
			startTransition(() => {
				deleteMovie(movieId).then((response) => {
					toast({
						description: <ToastMessage data={response} />,
					});
					router.refresh();
				});
			});
		}

		setDialogOpened((prev) => !prev);
	};

	useEffect(() => {
		router.refresh();
	}, []);

	return (
		<>
			<DeleteModal
				dialogOpened={dialogOpened}
				setDialogOpened={setDialogOpened}
				isPending={isPending}
				onDeleteItem={onDeleteEvent}
				text='Ви впевнені що хочете видалити фільм?'
			/>
			<SectionHeader className='mb-4 mt-5' title='Активні фільми' />
			<DataTable
				editableColumns={mappedDropdownMenuColumns}
				columns={moviesDefinedColumns({
					onEdit: (row) =>
						router.push(`${ROUTER_PATHS.EDIT_MOVIE}?movieId=${row.id}`),
					onDelete: (id) => handleDialog(id),
				})}
				data={movies}
				isLoading={false}
				buttonRoute={ROUTER_PATHS.CREATE_MOVIE}
				emptyDataMessage='Немає активних фільмів'
				omitDropdownValues={['orderRow', 'Дія']}
			/>
			<SectionHeader className='mb-4 mt-16' title='Архів фільмів' />
			<DataTable
				editableColumns={mappedDropdownMenuColumns}
				columns={moviesDefinedColumns({
					onEdit: (row) =>
						router.push(`${ROUTER_PATHS.EDIT_MOVIE}?movieId=${row.id}`),
					onDelete: (id) => handleDialog(id),
				})}
				data={archiveMovies}
				isLoading={false}
				emptyDataMessage='Немає архівних фільмів'
				omitDropdownValues={['orderRow', 'Дія']}
				searchable
				hasPagination
				searchField='title'
			/>
		</>
	);
};

export default MovieList;
