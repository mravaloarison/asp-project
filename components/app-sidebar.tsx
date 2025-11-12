"use client";

import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

import { NavMain } from "@/components/nav-main";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

const data = {
	navMain: [
		{
			title: "View reports",
			url: "/dashboard/reports-list",
		},
		{
			title: "Create new report",
			url: "/dashboard/new-form",
		},
	],
} as any;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="/dashboard">
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-medium">
										Aspinall Report
									</span>
									<span className="">v1.0.0</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<div className="p-1">
					<Button
						className="w-full mb-4"
						onClick={async () => {
							const auth = getAuth();
							try {
								await signOut(auth);
								window.location.href = "/login";
							} catch (error) {
								console.error("Error signing out:", error);
							}
						}}
					>
						Log out
					</Button>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
