'use client';
import { useState } from 'react';

import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

type Props = {
	children: React.ReactNode;
};

const SiderBar = ({ children }: Props) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="lg:hidden absolute right-0 button-square button-indigo dark:button-teal p-2 text-2xl rounded-bl"
			>
				<AiOutlineMenu />
			</button>
			<nav
				className={`fixed z-30 top-0 left-0 lg:-translate-x-0 w-3/4 md:w-1/2 lg:w-1/5 transition-all duration-300 ${
					isOpen
						? 'visible -translate-x-0'
						: 'invisible lg:visible -translate-x-full lg:-translate-x-0'
				} h-screen shadow-md bg-white dark:bg-dodgerblue-900 lg:dark:bg-dodgerblue-900/30 flex flex-col items-center p-2 gap-2`}
			>
				<button
					onClick={() => setIsOpen(false)}
					className="lg:hidden p-2 text-2xl rounded-full button-square button-indigo dark:button-teal ml-auto"
				>
					<AiOutlineClose />
				</button>
				{children}
			</nav>
			{isOpen && (
				<div
					onClick={() => setIsOpen(false)}
					aria-hidden="false"
					className="fixed lg:hidden z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-200/30 dark:bg-blue-950/20 w-screen h-screen"
				/>
			)}
		</>
	);
};

export default SiderBar;
