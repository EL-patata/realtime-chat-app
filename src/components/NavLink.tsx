'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { AnchorHTMLAttributes, FC } from 'react';

type Props = LinkProps &
	AnchorHTMLAttributes<HTMLAnchorElement> & {
		activeClassName: string;
		NotActiveClassName: string;
	};

const NavLink: FC<Props> = ({
	className,
	children,
	activeClassName,
	NotActiveClassName,
	href,
	...props
}) => {
	const pathName = usePathname();

	const currentPath = pathName === href;

	return (
		<Link
			href={href}
			className={`${className} ${
				currentPath ? activeClassName : NotActiveClassName
			}`}
			{...props}
		>
			{children}
		</Link>
	);
};

export default NavLink;
