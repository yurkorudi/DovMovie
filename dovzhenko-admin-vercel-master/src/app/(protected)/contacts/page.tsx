import EditContacts from '@/components/contacts/EditContacts';
import { getContacts } from '@/actions/contacts';

const ContactsPage = async () => {
	const contacts = await getContacts();

	return <EditContacts contacts={contacts} />;
};

export default ContactsPage;
