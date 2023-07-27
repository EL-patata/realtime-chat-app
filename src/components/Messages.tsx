'use client';
import { pusherClient } from '@/libs/pusher';
import { toPusherKey } from '@/libs/utils';
import { Message } from '@/libs/validations/messages';
import { FC, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';

type Props = {
	initialMessages: Message[];
	chatId: string;
	sessionId: string;
};

const Messages: FC<Props> = ({ initialMessages, sessionId, chatId }) => {
	const scrollDownRef = useRef<HTMLDivElement>(null!);

	const [messages, setMessages] = useState<Message[]>(initialMessages);

	useEffect(() => {
		pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

		const messageHandler = (message: Message) => {
			setMessages((prev) => [message, ...prev]);
		};

		pusherClient.bind('incoming-message', messageHandler);

		return () => {
			pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
			pusherClient.unbind('incoming-message', messageHandler);
		};
	}, [chatId]);

	function formatTimeStamp(date: number) {
		return format(date, 'HH:mm');
	}

	return (
		<div
			id="messages"
			className="flex flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
		>
			<div ref={scrollDownRef} />
			{messages.map((message, index) => {
				const isCurrentUser = message.senderId == sessionId;

				const hasNextMessageFromSameUser =
					messages[index - 1]?.senderId === messages[index].senderId;

				return (
					<div
						className="chat-message"
						key={`${message.id}-${message.timestamp}`}
					>
						<div className={`flex items-end ${isCurrentUser && 'justify-end'}`}>
							<div
								className={`flex flex-col space-y-2 max-w-xs mx-2 ${
									isCurrentUser ? 'order-1 items-end' : 'order-2 items-start'
								}`}
							>
								<span
									className={`px-4 py-2 rounded-lg inline-block selection:bg-blue-500 dark:selection:bg-blue-600 ${
										isCurrentUser
											? 'text-white bg-indigo-600 dark:bg-teal-600'
											: 'bg-gray-200 dark:bg-dodgerblue-800'
									}
                  ${
										!hasNextMessageFromSameUser && isCurrentUser
											? 'rounded-br-none'
											: null
									}
                  ${
										!hasNextMessageFromSameUser && !isCurrentUser
											? 'rounded-bl-none'
											: null
									}
                  `}
								>
									{message.text}
									{` `}
									<span className="ml-2 text-xs">
										{formatTimeStamp(message.timestamp)}
									</span>
								</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Messages;
