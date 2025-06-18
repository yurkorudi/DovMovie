import { z } from 'zod';
import { ShowtimeSchema } from '@/schemas/movie';
import { DateListType } from '@/lib/types/common';
import moment from 'moment';

export const showtimeToDateList = (
	showtime: z.infer<typeof ShowtimeSchema>[],
) => {
	const groupedByDate = showtime.reduce(
		(acc, item) => {
			const date = moment.utc(item.dateTime).tz('Europe/Kyiv');

			const time = date.format('HH:mm');
			const dateString = date.format('YYYY-MM-DD');

			if (!acc[dateString]) {
				acc[dateString] = {
					date: date.toDate(),
					time: [],
					id: item.id,
				};
			}

			acc[dateString].time.push(time);

			return acc;
		},
		{} as Record<string, DateListType>,
	);

	return Object.values(groupedByDate);
};
