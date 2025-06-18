import { ActionMeta } from 'react-select';

export type TSelectType = {
	value: string | number;
	label: string;
};

export type TMySelect = {
	className?: string;
	defaultValue?: TSelectType;
	classNamePrefix?: string;
	isDisabled?: boolean;
	isLoading?: boolean;
	isClearable?: boolean;
	isRtl?: boolean;
	isSearchable?: boolean;
	name?: string;
	placeholder?: string;
	options: TSelectType[];
	onChange: ((newValue: any, actionMeta: ActionMeta<any>) => void) | undefined;
	value: any;
	isMulti?: boolean;
	closeMenuOnSelect?: boolean;
};

export enum ApplicationType {
	SUBCATCH = 'SUBCATCH',
	EARCATCH = 'EARCATCH',
	GRETA = 'GRETA',
	MOVIEREADING = 'MOVIEREADING',
	PODYV = 'PODYV',
}
