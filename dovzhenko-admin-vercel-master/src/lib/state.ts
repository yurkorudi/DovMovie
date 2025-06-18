import { CheckedState } from '@radix-ui/react-checkbox';

export const handleSelectedItems = (
	rowDataId: string,
	checked: CheckedState,
	prevState: string[],
) => {
	const containsId = prevState.includes(rowDataId);

	if (checked && containsId) {
		return prevState;
	}

	if (!checked && containsId) {
		return prevState.filter((id) => id !== rowDataId);
	}

	if (checked && !containsId) {
		return [...prevState, rowDataId];
	}

	return prevState;
};
