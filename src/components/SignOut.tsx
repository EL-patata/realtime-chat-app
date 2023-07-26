'use client';
import { signOut } from 'next-auth/react';
import { PiSignOutFill } from 'react-icons/pi';

const SignOut = () => {
	return (
		<button
			className="button-square button-indigo dark:button-blue p-3 text-3xl rounded-md my-auto "
			onClick={() => signOut()}
		>
			<PiSignOutFill />
		</button>
	);
};

export default SignOut;
