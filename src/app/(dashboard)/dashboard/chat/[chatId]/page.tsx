import ChatInput from '@/components/ChatInput';
import Messages from '@/components/Messages';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/libs/auth';
import { db } from '@/libs/db';
import { messageArrayValidaton } from '@/libs/validations/messages';
import { Message, User } from '@/types/databaseTypes';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { notFound } from 'next/navigation';

type Props = {
	params: {
		chatId: string;
	};
};

async function getChatMessages(chatId: string) {
	try {
		const result: string[] = await fetchRedis(
			`zrange`,
			`chat:${chatId}:messages`,
			0,
			-1
		);

		const dbMessages = result.map((message) => JSON.parse(message) as Message);

		const reversedMessages = dbMessages.reverse();

		const messages = messageArrayValidaton.parse(reversedMessages);

		return messages;
	} catch (error) {
		notFound();
	}
}

const page = async ({ params }: Props) => {
	const { chatId } = params;

	const session = await getServerSession(authOptions);

	if (!session) notFound();

	const { user } = session;

	const [userId1, userId2] = chatId.split(`--`);

	if (user.id !== userId1 && user.id !== userId2) {
		notFound();
	}

	const chatPartnerId = user.id === userId1 ? userId2 : userId1;

	const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;

	const initialMessages = await getChatMessages(chatId);

	return (
		<div className="grid grid-rows-chat h-screen ">
			<header className="border-b border-indigo-600 dark:border-teal-400 shadow-md p-2">
				<div className="flex items-center gap-2">
					<span className="relative w-12 aspect-square">
						<Image
							className="rounded-full"
							src={chatPartner?.image}
							alt={`${chatPartner?.name} profile picture`}
							fill
						/>
					</span>{' '}
					<span className="flex flex-col">
						<h2 className="text-xl">{chatPartner.name}</h2>
						<p className="text-sm text-indigo-600 dark:text-teal-400">
							{chatPartner.email}
						</p>
					</span>
				</div>
			</header>
			<Messages
				chatId={chatId}
				initialMessages={initialMessages}
				sessionId={session.user.id as string}
			/>
			<ChatInput chatId={chatId} chatPartner={chatPartner} />
		</div>
	);
};

export default page;
