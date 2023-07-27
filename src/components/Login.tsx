'use client';

import { signIn } from 'next-auth/react';
import { FC } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { BsGithub } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';

type Props = {};

const Login: FC<Props> = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	async function loginWithSocials(provider: 'google' | 'github') {
		setIsLoading(true);
		try {
			await signIn(provider);
		} catch (error) {
			toast.error(`Could not login, Please try again`);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="w-screen h-screen py-40 flex justify-center bg-slate-100 dark:bg-dodgerblue-800">
			<div className="flex flex-col gap-10">
				<h1 className="text-2xl">Welcome to zuccsucc</h1>
				<div className="flex flex-col gap-4">
					<button
						disabled={isLoading}
						className="button button-white flex gap-2 items-center disabled:opacity-50"
						onClick={() => loginWithSocials('google')}
					>
						<FcGoogle className="text-2xl" /> Sign in with Google
					</button>
					<button
						disabled={isLoading}
						className="button button-black flex gap-2 items-center disabled:opacity-50"
						onClick={() => loginWithSocials('github')}
					>
						<BsGithub className="text-2xl" /> Sign in with GitHub
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
