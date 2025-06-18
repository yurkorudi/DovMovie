import React from 'react';
import Select from 'react-select';
import { cn } from '@/lib/utils';
import { TMySelect } from '@/lib/types/select';

const MySelect = ({
	className,
	defaultValue,
	classNamePrefix,
	isDisabled,
	isLoading,
	isClearable,
	isRtl,
	isSearchable,
	name,
	options,
	placeholder,
	onChange,
	value,
	isMulti,
	closeMenuOnSelect,
}: TMySelect) => {
	return (
		<Select
			className={cn(
				className,
				'hover:box-shadow-none focus-visible:outline-none [&>div]:border-slate-200 [&>div]:hover:border-slate-200',
			)}
			classNamePrefix={cn('react-select', classNamePrefix)}
			defaultValue={defaultValue}
			isDisabled={isDisabled}
			isLoading={isLoading}
			isClearable={isClearable}
			isRtl={isRtl}
			isSearchable={isSearchable}
			name={name}
			options={options}
			placeholder={placeholder}
			onChange={onChange}
			value={value || null}
			isMulti={isMulti}
			closeMenuOnSelect={closeMenuOnSelect}
		/>
	);
};

export default MySelect;
