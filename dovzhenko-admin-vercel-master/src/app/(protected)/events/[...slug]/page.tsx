import AddEditEvent from '@/components/events/AddEditEvent';
import { notFound } from 'next/navigation';
import { useServerPathname } from '@/lib/routes';
import { getEventById } from '@/actions/events';
import { ROUTER_PATHS } from '@/routes';

const allowedRoutes = [ROUTER_PATHS.EDIT_EVENT, ROUTER_PATHS.ADD_EVENT];

const AddEditEvents = async () => {
	const { matchAllowedRoutes, searchParams } = useServerPathname();
	const event = await getEventById(searchParams?.eventId);

	if (!matchAllowedRoutes(allowedRoutes)) {
		return notFound();
	}

	return <AddEditEvent event={event} />;
};

export default AddEditEvents;
