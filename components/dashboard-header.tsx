"use client";

import { Avatar, Text, Button, Flex, Link } from "@radix-ui/themes";
import { PinRightIcon } from "@radix-ui/react-icons";
import { User } from "firebase/auth";

interface DashboardHeaderProps {
	user: User;
	logout: () => void;
}

export default function DashboardHeader({
	user,
	logout,
}: DashboardHeaderProps) {
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
			<Link href="/dashboard/profile" style={{ textDecoration: "none" }}>
				<Flex align="center" gap="2">
					<Avatar
						fallback={
							user.photoURL || user.email?.slice(0, 2) || "U"
						}
						radius="full"
					/>
					<Text>{user.email}</Text>
				</Flex>
			</Link>

			<Button onClick={logout} size="3">
				<PinRightIcon /> Logout
			</Button>
		</Flex>
	);
}
