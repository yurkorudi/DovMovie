import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DeleteModal = ({
	dialogOpened,
	setDialogOpened,
	isPending,
	onDeleteItem,
	text,
}: {
	dialogOpened: boolean;
	setDialogOpened: (state: boolean) => void;
	isPending: boolean;
	onDeleteItem: () => void;
	text: string;
}) => {
	return (
		<Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{text}</DialogTitle>
					<DialogDescription>
						Після видалення нічого не можна буде відновити
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						disabled={isPending}
						onClick={() => {
							setDialogOpened(false);
						}}
					>
						Ні
					</Button>
					<Button disabled={isPending} variant='outline' onClick={onDeleteItem}>
						Так
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteModal;
