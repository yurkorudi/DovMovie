'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { uk } from 'date-fns/locale/uk';
import TimePicker from 'react-time-picker';
import { CircleMinus } from 'lucide-react';
import ToastMessage from '@/components/toasts/toast-message';
import { useToast } from '@/components/ui/use-toast';
import { nanoid } from 'nanoid';
import { DateListType } from '@/lib/types/common';
registerLocale('uk', uk);

const defaultTime = '10:00';

const AddEditDatetimeModal = ({
	dialogOpened,
	setDialogOpened,
	onSave,
	onEditSave,
	data,
}: {
	dialogOpened: boolean;
	setDialogOpened: (state: boolean) => void;
	onSave: (date: Date, times: string[], id: string) => void;
	onEditSave: (date: Date, times: string[], id: string) => void;
	data: DateListType | null;
}) => {
	const [startDate, setStartDate] = useState<null | Date>(new Date());
	const { toast } = useToast();
	const isEdit = !!data;

	const timeValuesRef = useRef<string[]>([defaultTime]);
	const [timeValues, setTimeValues] = useState<string[]>([defaultTime]);

	const addTimePicker = () => {
		timeValuesRef.current.push(defaultTime);
		setTimeValues([...timeValuesRef.current]);
	};

	const updateTimeValue = (index: number, newValue: string) => {
		timeValuesRef.current[index] = newValue;
	};

	const updateTimeValues = () => setTimeValues([...timeValuesRef.current]);

	const removeTimePicker = (index: number) => {
		timeValuesRef.current = timeValuesRef.current.filter((_, i) => i !== index);
		setTimeValues([...timeValuesRef.current]);
	};

	const handleOpenChange = (value: boolean) => {
		setDialogOpened(value);
		setStartDate(new Date());
		setTimeValues([defaultTime]);
	};

	const handleSave = () => {
		if (startDate) {
			const selectedDate = new Date(startDate);
			const userOffset = selectedDate.getTimezoneOffset();
			selectedDate.setMinutes(selectedDate.getMinutes() - userOffset);

			onSave(selectedDate, timeValues, nanoid(3));
			handleOpenChange(false);
			setTimeValues([defaultTime]);
			timeValuesRef.current = [defaultTime];
		} else {
			toast({
				description: (
					<ToastMessage
						data={{
							message: 'Виберіть дату',
							success: false,
						}}
					/>
				),
			});
		}
	};

	const handleEditSave = (id: string) => {
		if (startDate) {
			const selectedDate = new Date(startDate);
			const userOffset = selectedDate.getTimezoneOffset();
			selectedDate.setMinutes(selectedDate.getMinutes() - userOffset);

			onEditSave(selectedDate, timeValues, id);
			handleOpenChange(false);
			setTimeValues([defaultTime]);
			timeValuesRef.current = [defaultTime];
		} else {
			toast({
				description: (
					<ToastMessage
						data={{
							message: 'Виберіть дату',
							success: false,
						}}
					/>
				),
			});
		}
	};

	useEffect(() => {
		if (data) {
			setStartDate(data.date);
			setTimeValues(data.time);
		}
	}, [data]);

	return (
		<Dialog
			open={dialogOpened}
			onOpenChange={(isOpen) => {
				handleOpenChange(isOpen);

				setTimeValues([defaultTime]);
				timeValuesRef.current = [defaultTime];
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='mb-4'>Додати дату показу</DialogTitle>
				</DialogHeader>
				<div className='flex flex-col gap-4'>
					<div className='max-w-[200px]'>
						<p className='mb-2 inline-block font-bold'>Дата</p>
						<DatePicker
							selected={startDate}
							onChange={(date) => setStartDate(date)}
							dateFormat='d MMMM, yyyy'
							className='relative border-b border-b-primary px-2'
							locale='uk'
						/>
					</div>
					<div>
						<p className='mb-2 font-bold'>Час показу</p>
						{timeValues.map((time, index) => (
							<div key={nanoid()} className='mb-2 flex items-center gap-2'>
								<TimePicker
									onChange={(value) => {
										updateTimeValue(index, value || defaultTime);
										console.log(value);
									}}
									onClockClose={updateTimeValues}
									value={time}
									format='HH:mm'
								/>
								<button
									onClick={() => removeTimePicker(index)}
									className='rounded-full bg-red-400 p-1 text-white'
									title='Видалити час показу'
								>
									<CircleMinus className='h-3 w-3' />
								</button>
							</div>
						))}
						<Button
							variant='secondary'
							className='mt-2'
							onClick={addTimePicker}
						>
							Додати
						</Button>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={() => (isEdit ? handleEditSave(data.id) : handleSave())}
						className='mt-4'
					>
						{isEdit ? 'Редагувати' : 'Зберегти'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddEditDatetimeModal;
