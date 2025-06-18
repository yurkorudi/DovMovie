import MainCarousel from '@/components/carousel/main-carousel';
import {
	getContacts,
	getCurrentMovies,
	getEvents,
	getMainCarouselSlides,
	getStudios,
	getTeamSlides,
} from '@/actions';
import EventList from '@/components/events/event-list';
import { TLocale } from '@/lib/types/locales';
import Studios from '@/components/studios/Studios';
import AboutUs from '@/components/about-us/about-us';
import MovieList from '@/components/movies/homepage/movie-list';
import LandingWrapper from '@/components/landing-wrapper';

const Home = async ({ params: { locale } }: { params: TLocale }) => {
	const slides = await getMainCarouselSlides();
	const events = await getEvents();
	const studios = await getStudios();
	const team = await getTeamSlides();
	const contacts = await getContacts();
	const movies = await getCurrentMovies();

	return (
		<main className='main-bg h-full overflow-x-hidden'>
			<LandingWrapper>
				<MainCarousel slides={slides} />
				<EventList events={events} locale={locale} />
				<Studios studios={studios} />
				<MovieList movies={movies} locale={locale} />
				<AboutUs slides={team} locale={locale} contacts={contacts} />
			</LandingWrapper>
		</main>
	);
};

export default Home;
