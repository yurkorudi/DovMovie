export const convertDataToSelectOption = <T>(data: T[]) => {
	return data.map((item) => ({
		label: item,
		value: item,
	}));
};
