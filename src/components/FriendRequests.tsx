'use client';
import { pusherClient } from '@/libs/pusher';
import { toPusherKey } from '@/libs/utils';
import { IncomingFriendRequests } from '@/types/pusher';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
	AiOutlineCheck,
	AiOutlineClose,
	AiTwotoneCheckCircle,
} from 'react-icons/ai';

type Props = {
	sessionId: string;
	inComingFriendRequests: IncomingFriendRequests[];
};

const FriendRequests = ({ inComingFriendRequests, sessionId }: Props) => {
	const [friendRequests, setFriendRequests] = useState<
		IncomingFriendRequests[]
	>(inComingFriendRequests);

	const router = useRouter();

	const acceptFriend = async (senderId: string) => {
		await axios.post('/api/friends/accept', { id: senderId });

		setFriendRequests((prev) =>
			prev.filter((request) => request.senderId !== senderId)
		);

		router.refresh();
	};

	const denyFriend = async (senderId: string) => {
		await axios.post('/api/friends/deny', { id: senderId });

		setFriendRequests((prev) =>
			prev.filter((request) => request.senderId !== senderId)
		);

		router.refresh();
	};

	useEffect(() => {
		pusherClient.subscribe(
			toPusherKey(`user:${sessionId}:incoming_friend_requests`)
		);

		const friendRequestHandler = ({
			senderId,
			senderEmail,
		}: IncomingFriendRequests) => {
			setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
		};

		pusherClient.bind('incoming_friend_requests', friendRequestHandler);

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${sessionId}:incoming_friend_requests`)
			);
			pusherClient.unbind('incoming_friend_requests', friendRequestHandler);
		};
	}, [sessionId]);

	return (
		<div>
			{FriendRequests.length === 0 ? (
				<p>Nothing to show here...</p>
			) : (
				friendRequests.map((friendRequest) => (
					<div
						key={friendRequest.senderId}
						className="mx-auto md:w-1/2 flex gap-4 items-center button-indigo-transparent dark:button-blue-transparent rounded p-2 transition-all"
					>
						<p className="flex-1">{friendRequest.senderEmail}</p>
						<div className="flex gap-2">
							<button
								onClick={() => acceptFriend(friendRequest.senderId)}
								className="p-2 rounded-full button-square button-blue"
							>
								<AiOutlineCheck />
							</button>
							<button
								onClick={() => denyFriend(friendRequest.senderId)}
								className="p-2 rounded-full button-square button-rose"
							>
								<AiOutlineClose />
							</button>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default FriendRequests;
