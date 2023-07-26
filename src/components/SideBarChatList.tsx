'use client';
import { pusherClient } from '@/libs/pusher';
import { chatHrefConstructor, toPusherKey } from '@/libs/utils';
import { Message, User } from '@/types/databaseTypes';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsChatLeftTextFill } from 'react-icons/bs';
import CustomToast from './CustomToast';

type Props = {
	sessionId: string;
	friends: User[];
};

interface ExtendedMessage extends Message {
	senderImg: string;
	senderName: string;
}

const SideBarChatList: FC<Props> = ({ friends, sessionId }) => {
	const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

	const pathName = usePathname();

	const anchorRef = useRef<HTMLAnchorElement>(null!);

	const router = useRouter();

	const currentPath = pathName === anchorRef?.current?.pathname;

	useEffect(() => {
		if (pathName.includes(`chat`)) {
			setUnseenMessages((prev) => {
				return prev.filter((msg) => !pathName.includes(msg.senderId));
			});
		}
	}, [pathName]);

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));

		pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

		function newFriendHandler() {
			router.refresh();
		}

		function chatHandler(message: ExtendedMessage) {
			const shouldNotify =
				pathName !==
				`/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

			if (!shouldNotify) return;

			toast.custom(
				(t) => (
					<CustomToast
						t={t}
						senderId={message.senderId}
						senderImg={message.senderImg}
						sessionId={sessionId}
						senderName={message.senderName}
						senderMessage={message.text}
					/>
				),
				{ duration: 5000 }
			);
			setUnseenMessages((prev) => [...prev, message]);
		}

		pusherClient.bind(`new_message`, chatHandler);
		pusherClient.bind(`new_friend`, newFriendHandler);

		return () => {
			pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));

			pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
		};
	}, [pathName, router, sessionId]);

	return (
		<>
			<p className="mr-auto text-indigo-700 dark:text-blue-400 flex items-center gap-2">
				<BsChatLeftTextFill /> Your chats
			</p>
			<ul className="p-4 overflow-y-auto w-full max-h-1/4 flex flex-col gap-4 ">
				{friends.sort().map((friend) => {
					const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
						return unseenMsg?.senderId === friend?.id;
					}).length;
					return (
						<li key={friend.id} className="w-full">
							<a
								ref={anchorRef}
								className={`p-2 flex items-center gap-2 rounded border-indigo-600 ${
									currentPath
										? 'text-white bg-indigo-600 dark:bg-dodgerblue-800'
										: 'bg-inherit hover:bg-slate-100 dark:hover:bg-dodgerblue-800 transition-all'
								}`}
								href={`/dashboard/chat/${chatHrefConstructor(
									sessionId,
									friend.id
								)}`}
							>
								<div className="relative w-10 h-10">
									<Image
										src={friend?.image}
										className="rounded-full"
										referrerPolicy="no-referrer"
										fill
										alt={`${friend.name} profile picture`}
									/>
								</div>
								{friend.name}

								{unseenMessagesCount > 0 && (
									<p className="text-indigo-700 font-bold ml-auto dark:text-dodgerblue-300">
										{unseenMessagesCount}
									</p>
								)}
							</a>
						</li>
					);
				})}
			</ul>
		</>
	);
};

export default SideBarChatList;
