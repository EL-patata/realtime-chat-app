'use client';
import { FC, useEffect, useState } from 'react';
import NavLink from './NavLink';
import { PiUsersThreeFill } from 'react-icons/pi';
import { pusherClient } from '@/libs/pusher';
import { toPusherKey } from '@/libs/utils';

type Props = {
	sessionId: string;
	initialUnseenRequestCount: number;
};

const FriendRequestsSideBarOption: FC<Props> = ({
	initialUnseenRequestCount,
	sessionId,
}) => {
	const [unseenRequestsCount, setUnseenRequestsCount] = useState<number>(
		initialUnseenRequestCount
	);

	useEffect(() => {
		pusherClient.subscribe(
			toPusherKey(`user:${sessionId}:incoming_friend_requests`)
		);
		pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

		const friendRequestHandler = () => {
			setUnseenRequestsCount((prev) => prev + 1);
		};

		const addedFriendHandler = () => {
			setUnseenRequestsCount((prev) => prev - 1);
		};

		pusherClient.bind('incoming_friend_requests', friendRequestHandler);
		pusherClient.bind('new_friend', addedFriendHandler);

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${sessionId}:incoming_friend_requests`)
			);
			pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

			pusherClient.unbind('new_friend', addedFriendHandler);
			pusherClient.unbind('incoming_friend_requests', friendRequestHandler);
		};
	}, [sessionId]);

	return (
		<NavLink
			href={`/dashboard/requests`}
			className="w-full p-2 transition-all flex items-center gap-2 rounded"
			activeClassName="active-link group"
			NotActiveClassName="not-active-link"
		>
			<PiUsersThreeFill />
			Friend Requests
			{unseenRequestsCount > 0 && (
				<div className="ml-auto flex items-center justify-center w-6 h-6">
					<p className="font-medium text-lg">{unseenRequestsCount}</p>
				</div>
			)}
		</NavLink>
	);
};

export default FriendRequestsSideBarOption;
