export type TSeat = {
	id: string;
	row: number;
	number: number;
	taken: boolean;
};

export type TSession = {
	id: string;
	filmTitle: string;
	filmPoster: string;
	startTime: string;
	duration: number;
	price: number;
	hall: {
		id: string;
		name: string;
		seatsPerRow: number;
		rows: number;
	};
};
