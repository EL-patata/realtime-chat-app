import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/libs/auth';
import { chatHrefConstructor } from '@/libs/utils';
import { Message } from '@/types/databaseTypes';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { AiOutlineSend } from 'react-icons/ai';

export default async function page() {
	const session = await getServerSession(authOptions);

	const friends = await getFriendsByUserId(session?.user?.id as string);

	const friendsWithLastMessage = await Promise.all(
		friends.map(async (friend) => {
			const [lastMessage] = (await fetchRedis(
				'zrange',
				`chat:${chatHrefConstructor(
					session?.user.id as string,
					friend?.id
				)}:messages`,
				-1,
				-1
			)) as string[];
			return {
				...friend,
				lastMessage: JSON.parse(lastMessage) as Message,
			};
		})
	);

	console.log(friendsWithLastMessage);

	return (
		<div className="flex flex-col items-start p-4 gap-2">
			<h1 className="font-bold text-4xl text-center my-8">Recent chats</h1>
			{friendsWithLastMessage.length === 0 ? (
				<p className="text-sm text-indigo-600 dark:text-teal-400">
					Nothing to show here...
				</p>
			) : (
				friendsWithLastMessage.map((friend) => (
					<div
						key={friend.id}
						className="shadow-lg bg-slate-50 dark:bg-blue-600/60 p-2 rounded w-full flex gap-2"
					>
						<div className="relative z-10 w-12 aspect-square ">
							<Image
								className="rounded-full"
								src={friend?.image as string}
								fill
								referrerPolicy="no-referrer"
								alt={`${friend.name} profile picture`}
							/>
						</div>
						<span className="flex-1 ">
							<p className="truncate text-lg font-bold">{friend?.name}</p>
							<div className="flex items-center gap-2">
								<p className="truncate">{friend?.lastMessage?.text}</p>/
								<p className="text-xs text-indigo-600 dark:text-teal-400">
									{friend.lastMessage.timestamp}
								</p>
							</div>
						</span>

						<Link
							className="text-2xl w-fit h-fit p-2 my-auto button-square button-indigo dark:button-teal rounded-full"
							href={`/dashboard/chat/${chatHrefConstructor(
								session?.user.id as string,
								friend.id
							)}`}
						>
							<AiOutlineSend />
						</Link>
					</div>
				))
			)}
		</div>
	);
}
