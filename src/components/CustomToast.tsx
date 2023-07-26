import { chatHrefConstructor } from '@/libs/utils';
import Image from 'next/image';
import { FC } from 'react';
import toast, { type Toast } from 'react-hot-toast';

type Props = {
	t: Toast;
	sessionId: string;
	senderId: string;
	senderImg: string;
	senderName: string;
	senderMessage: string;
};

const CustomToast: FC<Props> = ({
	t,
	senderId,
	sessionId,
	senderImg,
	senderName,
	senderMessage,
}) => {
	return (
		<div
			className={`max-w-md flex items-center gap-4 p-4 rounded shadow-lg bg-white dark:bg-dodgerblue-800 ${
				t.visible ? 'animate-enter' : 'animate-leave'
			}`}
		>
			<a
				onClick={() => toast.dismiss(t.id)}
				href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
				className="flex items-center gap-2"
			>
				<div className="relative w-10 aspect-square">
					<Image
						src={senderImg}
						alt={`${senderName} profile picture`}
						fill
						referrerPolicy="no-referrer"
						className="rounded-full"
					/>
				</div>
				<span className="flex-1">
					<h2 className="text-indigo-600 dark:text-teal-400">{senderName}</h2>
					<p>{senderMessage}</p>
				</span>
			</a>
			<button
				onClick={() => toast.dismiss(t.id)}
				className="button button-indigo dark:button-teal"
			>
				Close
			</button>
		</div>
	);
};

export default CustomToast;
