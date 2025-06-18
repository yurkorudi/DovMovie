export const mappedDropdownMenuColumns = (name: string) => {
	switch (name) {
		case 'title':
			return 'Заголовок';
		case 'titleEng':
			return 'Заголовок(Eng)';
		case 'description':
			return 'Опис';
		case 'descriptionEng':
			return 'Опис(Eng)';
		case 'linkTitle':
			return 'Посилання';
		case 'linkTitleEng':
			return 'Посилання(Eng)';
		case 'typeImage':
			return 'Тип';
		case 'image':
			return 'Зображення';
		case 'startTime':
			return 'Дата';
		case 'Date':
			return 'Дата';
		default:
			return name;
	}
};
