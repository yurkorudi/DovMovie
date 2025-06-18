import { auth } from '@/auth';
import JsonViewer from '@/components/json-view';

const SessionInfoPage = async () => {
	const session = await auth();

	return <JsonViewer json={session} />;
};

export default SessionInfoPage;
