import moment, { Moment } from 'moment/moment';

export const generateWeekDates = (): Moment[] => {
	const today = moment();

	// Find the previous Thursday (or today if it's Thursday)
	const lastThursday = today
		.clone()
		.subtract((today.day() + 7 - 4) % 7, 'days')
		.startOf('day');

	const weekDates: Moment[] = [];

	// Generate dates from last Thursday to the following Wednesday
	for (let i = 0; i < 7; i++) {
		weekDates.push(lastThursday.clone().add(i, 'days'));
	}

	return weekDates;
};
