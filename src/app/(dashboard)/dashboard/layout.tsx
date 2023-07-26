import FriendRequestsSideBarOption from '@/components/FriendRequestsSideBarOption';
import NavLink from '@/components/NavLink';
import SideBarChatList from '@/components/SideBarChatList';
import SiderBar from '@/components/SiderBar';
import SignOut from '@/components/SignOut';
import ThemeButton from '@/components/ThemeButton';
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/libs/auth';
import { User } from '@/types/databaseTypes';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import React, { FC } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';

type Props = {
	children: React.ReactNode;
};

const layout: FC<Props> = async ({ children }) => {
	const session = await getServerSession(authOptions);

	const sessionId = session?.user.id as string;

	const unseenRequestCount = (
		(await fetchRedis(
			`smembers`,
			`user:${session?.user.id}:incoming_friend_requests`
		)) as User[]
	).length;

	const friends = await getFriendsByUserId(session?.user.id as string);

	return (
		<div className="lg:pl-[20%] w-full ">
			<SiderBar>
				{friends.length > 0 && (
					<SideBarChatList
						sessionId={session?.user.id as string}
						friends={friends as User[]}
					/>
				)}
				<NavLink
					href="/dashboard"
					className="transition-all p-2 rounded w-full"
					activeClassName="active-link"
					NotActiveClassName="not-active-link"
				>
					Dashboard
				</NavLink>
				<NavLink
					href="/dashboard/add"
					className="transition-all p-2 rounded w-full flex items-center gap-2"
					activeClassName="active-link"
					NotActiveClassName="not-active-link"
				>
					<AiOutlineUserAdd /> Add friends
				</NavLink>
				<FriendRequestsSideBarOption
					sessionId={sessionId}
					initialUnseenRequestCount={unseenRequestCount}
				/>
				<ThemeButton />
				<div className="flex items-center p-2 shadow-lg rounded-xl gap-2 w-full  dark:bg-dodgerblue-800 mt-auto">
					<span className="relative w-10 h-10">
						<Image
							className="rounded-full"
							src={session?.user?.image as string}
							alt={`${session?.user?.name} profile picture`}
							fill
						/>
					</span>{' '}
					<span className="flex flex-col flex-1">
						<h2 className="text-xl">{session?.user.name}</h2>
						<p className="text-sm text-indigo-600 dark:text-teal-400">
							{session?.user.email}
						</p>
					</span>
					<SignOut />
				</div>
			</SiderBar>

			<div>{children}</div>
		</div>
	);
};

export default layout;
