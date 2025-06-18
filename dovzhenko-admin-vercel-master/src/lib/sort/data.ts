import moment from 'moment/moment';

export const sortByGTE = <T extends { startTime: Date }>(data: T[]) => {
	return data.filter((item) => {
		return moment(item.startTime).isSameOrAfter(moment(), 'day');
	});
};

export const sortByLTE = <T extends { startTime: Date }>(data: T[]) => {
	return data.filter((slide) => {
		return moment(slide.startTime).isBefore(moment(), 'day');
	});
};

export const sortByStartTimeByAsc = <T extends { startTime: Date }>(
	data: T[],
) => {
	return data.sort((a, b) => {
		return moment(a.startTime).diff(moment(b.startTime));
	});
};

export const sortByOrder = <T extends { order: string }>(data: T[]) => {
	return data.sort((a, b) => {
		return Number(a.order) - Number(b.order);
	});
};
