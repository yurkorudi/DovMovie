import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckedState } from '@radix-ui/react-checkbox';

const TableDeleteButton = ({
	checkedAllCheckboxes,
	selectedItems,
	onDeleteButtonHandle,
}: {
	checkedAllCheckboxes?: CheckedState;
	selectedItems?: any[];
	onDeleteButtonHandle: () => void;
}) => {
	return checkedAllCheckboxes || selectedItems?.length ? (
		<Button variant={'destructive'} onClick={onDeleteButtonHandle}>
			Видалити
		</Button>
	) : null;
};

export default TableDeleteButton;
