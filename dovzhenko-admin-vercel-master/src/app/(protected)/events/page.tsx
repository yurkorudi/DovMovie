import { getAllEvents } from '@/actions/events';
import EventsTable from '@/components/tables/events-table';

const EventsPage = async () => {
	const events = await getAllEvents();

	return <EventsTable eventsList={events} />;
};

export default EventsPage;
export const revalidate = 0;
