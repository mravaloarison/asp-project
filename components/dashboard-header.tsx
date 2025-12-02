"use client";

import { Avatar, Text, Button, Flex, Link } from "@radix-ui/themes";
import { PinRightIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { User } from "firebase/auth";

interface DashboardHeaderProps {
	user: User;
	logout: () => void;
	pathname: string;
}

export default function DashboardHeader({
	user,
	logout,
	pathname,
}: DashboardHeaderProps) {
	const isOnProfile = pathname.endsWith("/profile");

	const profileLinkProps = {
		href: isOnProfile ? "/dashboard" : "/dashboard/profile",
		icon: isOnProfile ? <ArrowLeftIcon fontSize="8" /> : null,
		label: isOnProfile ? "Go to Dashboard" : user.email,
		textDecoration: "none",
	};

	return (
		<Flex
			gap="3"
			align="center"
			justify="between"
			p="3"
			style={{
				background: "var(--accent-1)",
				borderBottom: "1px solid var(--gray-a4)",
			}}
		>
			<Link
				href={profileLinkProps.href}
				style={{ textDecoration: profileLinkProps.textDecoration }}
			>
				<Flex align="center" gap="2">
					{!isOnProfile && (
						<Avatar
							fallback={
								user.photoURL || user.email?.slice(0, 2) || "U"
							}
							radius="full"
						/>
					)}
					{profileLinkProps.icon}{" "}
					<Text>{profileLinkProps.label}</Text>
				</Flex>
			</Link>

			<Button onClick={logout} size="3">
				<PinRightIcon /> Logout
			</Button>
		</Flex>
	);
}
