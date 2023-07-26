'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { BsFillMoonFill, BsSunFill } from 'react-icons/bs';

const ThemeButton = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<button
			className="w-fit button-indigo dark:button-teal p-3 text-2xl rounded-full transition-all"
			onClick={(e) => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
		>
			{theme === 'dark' ? <BsFillMoonFill /> : <BsSunFill />}
		</button>
	);
};

export default ThemeButton;
