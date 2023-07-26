import Login from '@/components/Login';
import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function page() {
	const session = await getServerSession(authOptions);

	if (session?.user) redirect('/');

	return (
		<>
			<Login />
		</>
	);
}
