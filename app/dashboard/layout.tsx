"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { app } from "@/app/firebase";

export default function Layout({ children }: { children: React.ReactNode }) {
	const auth = getAuth(app);
	const router = useRouter();
	const pathname = usePathname();

	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) router.replace("/login");
			else setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth, router]);

	if (loading) return <p>Loading...</p>;

	const breadcrumbItems = () => {
		if (pathname === "/dashboard")
			return (
				<>
					<BreadcrumbItem>
						<BreadcrumbPage>Dashboard</BreadcrumbPage>
					</BreadcrumbItem>
				</>
			);

		if (pathname === "/dashboard/new-form")
			return (
				<>
					<BreadcrumbItem>
						<BreadcrumbLink href="/dashboard">
							Dashboard
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>New Report</BreadcrumbPage>
					</BreadcrumbItem>
				</>
			);

		if (pathname === "/dashboard/reports-list")
			return (
				<>
					<BreadcrumbItem>
						<BreadcrumbLink href="/dashboard">
							Dashboard
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Report List</BreadcrumbPage>
					</BreadcrumbItem>
				</>
			);

		if (pathname.startsWith("/dashboard/reports-list/")) {
			const id = pathname.split("/").pop();
			return (
				<>
					<BreadcrumbItem>
						<BreadcrumbLink href="/dashboard">
							Dashboard
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/dashboard/reports-list">
							Report List
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{id}</BreadcrumbPage>
					</BreadcrumbItem>
				</>
			);
		}

		return (
			<>
				<BreadcrumbItem>
					<BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
				</BreadcrumbItem>
			</>
		);
	};

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className="flex flex-col h-screen">
					<header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>{breadcrumbItems()}</BreadcrumbList>
						</Breadcrumb>
					</header>

					<main className="flex-1 overflow-y-auto p-4">
						{children}
					</main>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
