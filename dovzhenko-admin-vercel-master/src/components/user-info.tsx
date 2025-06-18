import { ExtendedUser } from '@/next-auth';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CheckCircle } from 'lucide-react';

const UserInfo = ({ user, label }: { user?: ExtendedUser; label?: string }) => {
	return (
		<Card className='shadow-md'>
			<CardHeader>
				<p className='text-center text-2xl font-semibold'>{label}</p>
			</CardHeader>
			<CardContent className='space-y-3'>
				<div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
					<p className='text-sm font-medium'>ID</p>
					<p className='max-w-[300px] truncate rounded-md bg-slate-100 px-3 py-2 font-mono text-sm dark:bg-secondary'>
						{user?.id}
					</p>
				</div>
				<div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
					<p className='text-sm font-medium'>Name</p>
					<p className='max-w-[300px] truncate rounded-md bg-slate-100 px-3 py-2 font-mono text-sm dark:bg-secondary'>
						{user?.name}
					</p>
				</div>
				<div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
					<p className='text-sm font-medium'>Email</p>
					<p className='max-w-[300px] truncate rounded-md bg-slate-100 px-3 py-2 font-mono text-sm dark:bg-secondary'>
						{user?.email}
					</p>
				</div>
				<div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
					<p className='text-sm font-medium'>Role</p>
					<p className='max-w-[300px] truncate rounded-md bg-slate-100 px-3 py-2 font-mono text-sm dark:bg-secondary'>
						{user?.role}
					</p>
				</div>
				<div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
					<p className='text-sm font-medium'>Two Factor Auth</p>
					<p className='max-w-[300px] truncate rounded-md bg-slate-100 px-3 py-2 font-mono text-sm dark:bg-secondary'>
						{user?.isTwoFactorEnabled ? (
							<CheckCircle className='text-green-500' />
						) : (
							<ExclamationTriangleIcon className='h-[17px] w-[17px] text-yellow-500' />
						)}
					</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default UserInfo;
