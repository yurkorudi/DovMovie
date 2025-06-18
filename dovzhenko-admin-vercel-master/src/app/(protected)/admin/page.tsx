'use client';
import useCurrentRole from '@/hooks/use-current-role';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import RoleGate from '@/components/auth/role-gate';
import FormSuccess from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { admin } from '@/actions/admin';

const AdminPage = () => {
	const onServerActionClick = () => {
		admin().then((data) => {
			if (data) {
				if (data.success) {
					toast.success(data.success);
				} else {
					toast.error(data.error || 'ERROR');
				}
			}
		});
	};

	const onApiRouteClick = () => {
		fetch('/api/admin').then((res) => {
			if (res.ok) {
				toast.success('You have permissions to see the content');
			} else {
				toast.error('You do not have permissions to see the content');
			}
		});
	};

	const role = useCurrentRole();

	return (
		<Card className='shadow-md'>
			<CardHeader>
				<p className='text-center text-2xl font-semibold'>Role: {role}</p>
			</CardHeader>
			<CardContent className='space-y-4'>
				<RoleGate allowedRole={'ADMIN'}>
					<FormSuccess message='You have permissions to see the content' />
				</RoleGate>
				<div className='rounder-lg flex flex-row items-center justify-between border p-3 shadow-md'>
					<p className='text-sm font-medium'>Admin-only Server Action</p>
					<Button onClick={onServerActionClick}>Click to test</Button>
				</div>
				<div className='rounder-lg flex flex-row items-center justify-between border p-3 shadow-md'>
					<p className='text-sm font-medium'>Admin-only API Route</p>
					<Button onClick={onApiRouteClick}>Click to test</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default AdminPage;
