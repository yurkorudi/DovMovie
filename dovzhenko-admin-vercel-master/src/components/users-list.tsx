'use client';
import React, { useEffect, useState, useTransition } from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import DataTable from '@/components/table/DataTable';
import { deleteUser, getAllUsers } from '@/actions/users';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { z } from 'zod';
import { UserSchemaDB } from '@/schemas/user';
import { ROUTER_PATHS } from '@/routes';
import DeleteModal from '@/components/modals/DeleteModal';
import { useRouter } from 'next/navigation';

const userColumns = ({
	onEdit,
	onDelete,
}: {
	onEdit: (user: z.infer<typeof UserSchemaDB>) => void;
	onDelete: (id: string) => void;
}) => {
	const columns: ColumnDef<z.infer<typeof UserSchemaDB>>[] = [
		{
			header: "Ім'я",
			accessorKey: 'name',
		},
		{
			header: 'Email',
			accessorKey: 'email',
			meta: {
				style: {
					textAlign: 'center',
				},
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

const UsersList = () => {
	const [dialogOpened, setDialogOpened] = React.useState(false);
	const [userId, setUserId] = React.useState<string | null>(null);
	const [users, setUsers] = useState<z.infer<typeof UserSchemaDB>[] | null>([]);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	useEffect(() => {
		startTransition(() => {
			getAllUsers().then((data) => {
				setUsers(data);
			});
		});
	}, []);

	const handleDeleteUser = () => {
		startTransition(() => {
			deleteUser(userId!).then(() => {
				getAllUsers().then((data) => {
					setUsers(data);
					setDialogOpened(false);
				});
			});
		});
	};

	const handleEditUser = (id: string) => {
		router.push(`${ROUTER_PATHS.EDIT_USER}?userId=${id}`);
	};

	const handleDialog = (id: string | null) => {
		setDialogOpened(true);
		setUserId(id);
	};

	return (
		<>
			<DeleteModal
				dialogOpened={dialogOpened}
				setDialogOpened={setDialogOpened}
				isPending={isPending}
				onDeleteItem={handleDeleteUser}
				text='Ви впевнені що хочете видалити користувача?'
			/>
			<DataTable
				columns={userColumns({
					onEdit: (user) => handleEditUser(user.id),
					onDelete: (id) => handleDialog(id),
				})}
				data={users}
				isLoading={isPending}
				buttonRoute={ROUTER_PATHS.ADD_USER}
			/>
		</>
	);
};

export default UsersList;
