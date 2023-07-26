'use client';

import { User } from '@/types/databaseTypes';
import axios from 'axios';
import { FC, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineSend } from 'react-icons/ai';
import TextareaAutosize from 'react-textarea-autosize';

interface Props {
	chatPartner: User;
	chatId: string;
}

const ChatInput: FC<Props> = ({ chatPartner, chatId }) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [input, setInput] = useState<string>('');

	const sendMessage = async () => {
		if (!input) return;
		setIsLoading(true);

		try {
			await axios.post('/api/message/send', { text: input, chatId });
			setInput('');
			textareaRef.current?.focus();
		} catch {
			toast.error('Something went wrong. Please try again later.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="border-t p-2 border-gray-200  dark:border-teal-600 px-4 pt-4 mb-2 sm:mb-0">
			<div className="relative dark:bg-dodgerblue-900 flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-teal-700 focus-within:ring-2 focus-within:ring-indigo-600 dark:focus-within:ring-teal-400">
				<TextareaAutosize
					ref={textareaRef}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							sendMessage();
						}
					}}
					rows={1}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={`Message ${chatPartner.name}`}
					className=" block w-full resize-none border-0 bg-transparent placeholder:text-indigo-600 dark:placeholder:text-teal-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
				/>

				<div
					onClick={() => textareaRef.current?.focus()}
					className="py-2"
					aria-hidden="true"
				>
					<div className="py-px">
						<div className="h-9" />
					</div>
				</div>

				<div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
					<div className="flex-shrin-0">
						<button
							onClick={sendMessage}
							disabled={isLoading}
							className="button-square disabled:opacity-50 p-2 text-2xl rounded-full button-indigo dark:button-teal"
						>
							<AiOutlineSend />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatInput;
