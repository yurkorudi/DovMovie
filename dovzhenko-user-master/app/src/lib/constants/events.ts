import { EventTypeEnum } from '@/lib/types/carousel';

export const defineHoverTitle = (type: EventTypeEnum) => {
	switch (type) {
		case EventTypeEnum.KINO:
			return 'Довженко Кіно';
		case EventTypeEnum.MUSIC:
			return 'Довженко Музика';
		case EventTypeEnum.THEATER:
			return 'Довженко Театр';
		case EventTypeEnum.STANDUP:
			return 'Довженко Стендап';
		case EventTypeEnum.TALKS:
			return 'Довженко Говорить';
		default:
			return 'Довженко Перетворює';
	}
};

export const defineHoverTitleEng = (type: EventTypeEnum) => {
	switch (type) {
		case EventTypeEnum.KINO:
			return 'Dovzhenko Cinema';
		case EventTypeEnum.MUSIC:
			return 'Dovzhenko Music';
		case EventTypeEnum.THEATER:
			return 'Dovzhenko Theater';
		case EventTypeEnum.STANDUP:
			return 'Dovzhenko Standup';
		case EventTypeEnum.TALKS:
			return 'Dovzhenko Talks';
		default:
			return 'Dovzhenko Performance';
	}
};

export const defineImage = (type: EventTypeEnum) => {
	switch (type) {
		case EventTypeEnum.PERFORMANCE:
			return '/static/images/events/performance_rotated.png';
		case EventTypeEnum.KINO:
			return '/static/images/events/kino_rotated.png';
		case EventTypeEnum.MUSIC:
			return '/static/images/events/music_rotated.png';
		case EventTypeEnum.TALKS:
			return '/static/images/events/talks_rotated.png';
		case EventTypeEnum.THEATER:
			return '/static/images/events/teatr_rotated.png';
		case EventTypeEnum.STANDUP:
			return '/static/images/events/standup_rotated.png';
		default:
			return '/static/images/events/performance_rotated.png';
	}
};

export const defineMobileImage = (type: EventTypeEnum) => {
	switch (type) {
		case EventTypeEnum.PERFORMANCE:
			return '/static/images/events/performance.png';
		case EventTypeEnum.KINO:
			return '/static/images/events/kino.png';
		case EventTypeEnum.MUSIC:
			return '/static/images/events/music.png';
		case EventTypeEnum.TALKS:
			return '/static/images/events/talks.png';
		case EventTypeEnum.THEATER:
			return '/static/images/events/teatr.png';
		case EventTypeEnum.STANDUP:
			return '/static/images/events/standup.png';
		default:
			return '/static/images/events/performance.png';
	}
};
