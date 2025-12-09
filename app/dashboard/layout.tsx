"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Flex, Card, Grid } from "@radix-ui/themes";
import DashboardHeader from "@/components/dashboard-header";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(auth.currentUser);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

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
			setLoading(false);
			if (!currentUser) router.push("/signin");
		});
		return () => unsubscribe();
	}, [router]);

	useEffect(() => {
		if (pathname === "/dashboard") {
			router.replace("/dashboard/user");
		}
	}, [pathname, router]);

	const mapComponent = () => (
		<Grid gridColumn={{ sm: "span 1", md: "span 2" }}>
			<Card style={{ height: "100%" }}>{children}</Card>
		</Grid>
	);

	const hideDashboard = pathname.endsWith("/profile");

	if (loading || !user || pathname === "/dashboard") {
		return null;
	}

	return (
		<Flex
			direction="column"
			style={{
				width: "100vw",
				height: "100vh",
				background: "var(--gray-a2)",
			}}
		>
			<DashboardHeader user={user} logout={logout} pathname={pathname} />

			{hideDashboard ? (
				children
			) : (
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
							style={{ flexGrow: 1, minWidth: 0, height: "100%" }}
						>
							{mapComponent()}
							<DashboardSidebar />
						</Grid>
					</Flex>
				</Flex>
			)}
		</Flex>
	);
}
