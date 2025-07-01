'use server';

import { TEvent } from '@/lib/types/events';
import { sortedByStartTime } from '@/lib/sort';
import { TStudio } from '@/lib/types/studios';
import { TAboutUs } from '@/lib/types/about-us';
import { TContact } from '@/lib/types/contacts';

/**
 * Fetches main carousel slides data from the API.
 *
 * This function makes a GET request to the 'https://dvzh.tech/api/main-carousel' endpoint.
 * The 'cache' option is set to 'no-cache' to ensure that the data is always fetched from the server and not from the local cache.
 * The function returns a Promise that resolves to an array of main carousel slides data.
 *
 * @returns {Promise<any>} A Promise that resolves to an array of main carousel slides data.
 * @throws {Error} Throws an error if the fetch request fails.
 */
export const getMainCarouselSlides = async () => {
	try {
		const response = await fetch('http://localhost:3001/api/main-carousel', {
			cache: 'no-cache',
		});
		const data = await response.json();

		return data;
	} catch (error) {
		throw new Error('Failed to fetch main carousel slides data');
	}
};

/**
 * Fetches event data from the API.
 *
 * This function makes a GET request to the 'https://dvzh.tech/api/events' endpoint.
 * The 'cache' option is set to 'no-cache' to ensure that the data is always fetched from the server and not from the local cache.
 * The function returns a Promise that resolves to an array of TEvent objects.
 *
 * @returns {Promise<TEvent[]>} A Promise that resolves to an array of TEvent objects.
 * @throws {Error} Throws an error if the fetch request fails.
 */
export const getEvents = async (): Promise<TEvent[]> => {
	try {
		const response = await fetch('http://localhost:3001/api/events', {
			cache: 'no-cache',
		});
		const data = await response.json();

		return sortedByStartTime<TEvent>(data);
	} catch (error) {
		throw new Error('Failed to fetch events data');
	}
};

/*
 * Fetches studio data from the API.
 * @returns {Promise<TStudio[]>} A Promise that resolves to an array of TStudio objects.
 * @throws {Error} Throws an error if the fetch request fails.
 */
export const getStudios = async (): Promise<TStudio[]> => {
	try {
		const response = await fetch('http://localhost:3001/api/studios', {
			cache: 'no-cache',
		});
		const data = await response.json();

		return data;
	} catch (error) {
		throw new Error('Failed to fetch studios data');
	}
};

/*
 * Fetches team slides data from the API.
 * @returns {Promise<TAboutUs[]>} A Promise that resolves to an array of TAboutUs objects.
 * @throws {Error} Throws an error if the fetch request fails.
 */
export const getTeamSlides = async (): Promise<TAboutUs[]> => {
	try {
		const response = await fetch('http://localhost:3001/api/about-us', {
			cache: 'no-cache',
		});
		const data = await response.json();

		return data;
	} catch (error) {
		throw new Error('Failed to fetch teams data');
	}
};

/*
 * Fetches contacts data from the API.
 * @returns {Promise<Contact[]>} A Promise that resolves to an array of TAboutUs objects.
 * @throws {Error} Throws an error if the fetch request fails.
 */
export const getContacts = async (): Promise<TContact> => {
	try {
		const response = await fetch('http://localhost:3001/api/contacts');
		const data = await response.json();

		return data;
	} catch (error) {
		throw new Error('Failed to fetch contacts data');
	}
};

export const sendMessage = async (formData: FormData) => {
	try {
		const response = await fetch('http://localhost:3001/api/message', {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			return { success: false };
		}

		return { success: true };
	} catch (err) {
		console.log(err);

		return { success: false };
	}
};

export const getCurrentMovies = async () => {
	try {
		const response = await fetch('http://localhost:3001/api/movie', {
			cache: 'no-cache',
		});
		const data = await response.json();

		return data;
	} catch (err) {
		console.log(err);
	}
};

export const getMovieById = async (id: string) => {
	try {
		const response = await fetch(`http://localhost:3001/api/movie/get?id=${id}`, {
			cache: 'no-cache',
		});
		const data = await response.json();

		return data;
	} catch (err) {
		console.log(err);
	}
};
