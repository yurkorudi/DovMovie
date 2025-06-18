import { EventType } from '@prisma/client';
import { ApplicationType } from '@/lib/types/select';

export const orderSelect = [
	{ label: '1', value: '1' },
	{ label: '2', value: '2' },
	{ label: '3', value: '3' },
	{ label: '4', value: '4' },
	{ label: '5', value: '5' },
	{ label: '6', value: '6' },
	{ label: '7', value: '7' },
	{ label: '8', value: '8' },
	{ label: '9', value: '9' },
	{ label: '10', value: '10' },
];

export const typeSelect = [
	{ label: EventType.PERFORMANCE, value: EventType.PERFORMANCE },
	{ label: EventType.KINO, value: EventType.KINO },
	{ label: EventType.MUSIC, value: EventType.MUSIC },
	{ label: EventType.THEATER, value: EventType.THEATER },
	{ label: EventType.TALKS, value: EventType.TALKS },
	{ label: EventType.STANDUP, value: EventType.STANDUP },
];

export const appsSelect = [
	{ label: ApplicationType.SUBCATCH, value: ApplicationType.SUBCATCH },
	{ label: ApplicationType.EARCATCH, value: ApplicationType.EARCATCH },
	{ label: ApplicationType.GRETA, value: ApplicationType.GRETA },
	{ label: ApplicationType.MOVIEREADING, value: ApplicationType.MOVIEREADING },
	{ label: ApplicationType.PODYV, value: ApplicationType.PODYV },
];
