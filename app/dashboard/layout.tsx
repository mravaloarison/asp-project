"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Flex, Card, Grid } from "@radix-ui/themes";
import UserCard from "@/components/dashboard-user-card";
import DashboardHeader from "@/components/dashboard-header";
import DashboardListSectionHeader from "@/components/dashboard-list-header";
import ZoneCard from "@/components/dashboard-zone-card";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(auth.currentUser);
	const [currentSegment, setCurrentSegment] = useState<string>("users");
	const router = useRouter();
	const pathname = usePathname();

	const [currentPath, setCurrentPath] = useState<string>(pathname);

	useEffect(() => {
		setCurrentPath(pathname);
	}, [pathname]);

	const logout = async () => {
		try {
			await signOut(auth);
			router.push("/signin");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			if (!currentUser) {
				router.push("/signin");
			}
		});
		return () => unsubscribe();
	}, [router]);

	const listOfUsers = () => {
		return (
			<Flex
				gap="3"
				direction="column"
				flexGrow="1"
				minHeight="0"
				style={{
					overflowY: "scroll",
					scrollbarWidth: "thin",
					minWidth: 0,
				}}
			>
				{[...Array(12)].map((_, i) => (
					<UserCard
						name="Acme Corp"
						company="Tech Solutions Inc"
						department="Urban Development"
						locations={2}
						avatarFallback="AC"
						key={i}
					/>
				))}
			</Flex>
		);
	};

	const listOfZones = () => {
		return (
			<Flex
				gap="3"
				direction="column"
				flexGrow="1"
				minHeight="0"
				style={{
					overflowY: "scroll",
					scrollbarWidth: "thin",
					minWidth: 0,
				}}
			>
				{[...Array(4)].map((_, i) => (
					<ZoneCard
						ZoneName={`Zone ${i + 1}`}
						numberOfUsers={Math.floor(Math.random() * 100)}
						numberOfLocations={Math.floor(Math.random() * 20)}
						key={i}
					/>
				))}
			</Flex>
		);
	};

	const sidebarList = () => {
		return (
			<Card
				size="2"
				style={{
					height: "100%",
					display: "flex",
					flexDirection: "column",
					minWidth: 0,
				}}
			>
				<DashboardListSectionHeader
					currentSegment={currentSegment}
					setCurrentSegment={setCurrentSegment}
					search=""
					setSearch={() => {}}
					totalFound={12}
				/>
				{currentSegment === "users" ? listOfUsers() : listOfZones()}
			</Card>
		);
	};

	const mapComponent = () => {
		return (
			<Grid gridColumn="span 2">
				<Card style={{ height: "100%" }}></Card>
			</Grid>
		);
	};

	const dashBoardContent = () => {
		return (
			<Flex
				direction="column"
				p="3"
				gap="3"
				style={{ flexGrow: 1, minHeight: 0 }}
			>
				<Flex style={{ flexGrow: 1, minHeight: 0 }} pb="1">
					<Grid
						columns={{ sm: "1", md: "3" }}
						gap="3"
						style={{
							flexGrow: 1,
							minWidth: 0,
							height: "100%",
						}}
					>
						{mapComponent()}
						{sidebarList()}
					</Grid>
				</Flex>
			</Flex>
		);
	};

	return (
		<Flex
			direction="column"
			style={{
				width: "100vw",
				height: "100vh",
				background: "var(--gray-a2)",
			}}
		>
			{user && (
				<DashboardHeader
					user={user}
					logout={logout}
					pathname={currentPath}
				/>
			)}
			{currentPath === "/dashboard" && dashBoardContent()}
			{children}
		</Flex>
	);
}
