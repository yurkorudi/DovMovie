export const sortedByStartTime = <T extends { startTime: Date | string }>(
	data: T[],
): T[] =>
	data.sort((a, b) => {
		const dateA = new Date(a.startTime).getTime();
		const dateB = new Date(b.startTime).getTime();

		return dateA - dateB;
	});
