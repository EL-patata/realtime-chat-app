import FriendRequests from '@/components/FriendRequests';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';

const page = async () => {
	const session = await getServerSession(authOptions);

	const incomingSenderIds = (await fetchRedis(
		`smembers`,
		`user:${session?.user.id}:incoming_friend_requests`
	)) as string[];

	const incomingFriendRequests = await Promise.all(
		incomingSenderIds.map(async (senderId) => {
			const sender = (await fetchRedis(`get`, `user:${senderId}`)) as string;

			const parsedSender = JSON.parse(sender);

			return {
				senderId,
				senderEmail: parsedSender.email,
			};
		})
	);

	return (
		<main className="pt-8 p-4 w-full">
			<h1 className="font-bold text-3xl mb-8 text-center">Accept requests</h1>
			<FriendRequests
				sessionId={session?.user.id as string}
				inComingFriendRequests={incomingFriendRequests}
			/>
		</main>
	);
};

export default page;
