export type CooperationItem = {
	id: number;
	title: string;
	titleEng: string;
	description: string;
	descriptionEng: string;
	specs: Record<string, string>;
	images: string[];
	capacity: number;
	rider?: Record<string, string[][]>;
};

export const cooperation: CooperationItem[] = [
	{
		id: 0,
		title: 'Концертна зала',
		titleEng: 'Concert hall',
		description:
			'У Концертній зaлі відбувaються: концерти, кінопокaзи, презентaції, вистaви, форуми, лекції, дискусії, тощо.',
		descriptionEng:
			'Concerts, film screenings, presentations, exhibitions, forums, lectures, discussions, etc. take place in the Concert Hall.',
		specs: {
			square: '745.6',
			volume: '7500',
			length: '31',
			width: '24',
			screen: '18х9',
			scene: '18х6',
		},
		rider: {
			uk: [
				['Проектор NEC PA672W 6,700 ANSI Lumens', '1'],
				['Мікрофон Sennheiser E935', '6'],
				['Радіосистема MGX-24B', '2'],
				['Радіосистема TS-8808HH', '2'],
				['Мікшерний пульт Behringer XENYX XI 204 USB', '1'],
				['Акустична система 12 DHA 350', '2'],
				['Підсилювальний модуль de 350', '4'],
				['Стійки під акустичні системи DHA', '4'],
				['Сценічне освітлення LED Flat Par 12W', '18'],
			],
			en: [
				['Projector NEC PA672W 6,700 ANSI Lumens', '1'],
				['Microphone Sennheiser E935', '6'],
				['Radio system MGX-24B', '2'],
				['Radio system TS-8808HH', '2'],
				['Mixing console Behringer XENYX XI 204 USB', '1'],
				['Speaker system 12 DHA 350', '2'],
				['Amplifier module  de 350', '4'],
				['Racks for speakers DHA', '4'],
				['Scenic lighting LED Flat Par 12W', '18'],
			],
		},
		images: [
			'/static/images/cooperation/concert-hall/hall_1_1.jpg',
			'/static/images/cooperation/concert-hall/hall_1_2.jpg',
			'/static/images/cooperation/concert-hall/hall_1_3.jpg',
			'/static/images/cooperation/concert-hall/dress_room.jpg',
		],
		capacity: 747,
	},
	{
		id: 1,
		title: 'Кінозал',
		titleEng: 'Cinema',
		description: 'Зал для показу кіно.',
		descriptionEng: 'Hall for showing movies.',
		specs: {
			square: '272',
			volume: '2000',
			length: '24',
			width: '11',
			screen: '10x5.5',
			scene: '8х4',
		},
		images: ['/static/images/cooperation/rectangle-freeze.jpg'],
		capacity: 196,
	},
	{
		id: 2,
		title: 'Jazz Hall(2-й поверх)',
		titleEng: 'Jazz Hall',
		description:
			'Jazz Hall (2-й поверх): для проведення камерних подій, конференцій, вистав та презентацій на 100 осіб',
		descriptionEng:
			'Jazz Hall (2nd floor): for chamber events, conferences, performances and presentations for 100 people',
		specs: {
			square: '204',
			volume: '670',
			length: '18',
			width: '11.3',
			wall: '12.2x3.5',
		},
		images: [
			'/static/images/cooperation/jazz-hall/1.webp',
			'/static/images/cooperation/jazz-hall/2.jpg',
			'/static/images/cooperation/jazz-hall/3.jpg',
		],
		rider: {
			uk: [
				['Проектор NEC PA672W 6,700 ANSI Lumens', '1'],
				['Мікрофон Sennheiser E935', '6'],
				['Радіосистема MGX-24B', '2'],
				['Радіосистема TS-8808HH', '2'],
				['Мікшерний пульт Behringer XENYX XI 204 USB', '1'],
				['Акустична система 12 DHA 350', '2'],
				['Телевізор Samsung 7 series 65 дюймів', '1'],
				['Фліпчарт', '2'],
			],
			en: [
				['Projector NEC PA672W 6,700 ANSI Lumens', '1'],
				['Microphone Sennheiser E935', '6'],
				['Radio system MGX-24B', '2'],
				['Radio system TS-8808HH', '2'],
				['Mixing console Behringer XENYX XI 204 USB', '1'],
				['Speaker system 12 DHA 350', '2'],
				['Samsung TV 7 series 65 inch', '1'],
				['Flipchart', '2'],
			],
		},
		capacity: 100,
	},
	{
		id: 3,
		title: 'Простір нa даху',
		titleEng: 'Space on the roof',
		description:
			'Простір для кінопоказів, концертів, презентацій або прийомів на 200 осіб.',
		descriptionEng:
			'Space for film screenings, concerts, presentations or receptions for 200 people.',
		specs: {
			square: '580',
			length: '36',
			width: '18',
		},
		images: [
			'/static/images/cooperation/roof/1.webp',
			'/static/images/cooperation/roof/2.webp',
		],
		rider: {
			uk: [
				['Проектор NEC PA672W 6,700 ANSI Lumens', '1'],
				['Мікрофон Sennheiser E935', '6'],
				['Радіосистема MGX-24B', '2'],
				['Радіосистема TS-8808HH', '2'],
				['Мікшерний пульт Behringer XENYX XI 204 USB', '1'],
				['Акустична система 12 DHA 350', '2'],
				['Екран', '3x4'],
			],
			en: [
				['Projector NEC PA672W 6,700 ANSI Lumens', '1'],
				['Microphone Sennheiser E935', '6'],
				['Radio system MGX-24B', '2'],
				['Radio system TS-8808HH', '2'],
				['Mixing console Behringer XENYX XI 204 USB', '1'],
				['Speaker system 12 DHA 350', '2'],
				['Screen', '3x4'],
			],
		},
		capacity: 200,
	},
];
