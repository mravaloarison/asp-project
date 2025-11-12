"use client";

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ICONS } from "@/components/icon";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: keyof typeof ICONS;
		isActive?: boolean;
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => {
					const IconComponent = item.icon ? ICONS[item.icon] : null;

					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								className={
									item.isActive
										? "bg-sidebar-accent text-sidebar-accent-foreground"
										: ""
								}
							>
								<a
									href={item.url}
									className="flex items-center gap-2"
								>
									{IconComponent && (
										<IconComponent className="size-4" />
									)}
									{item.title}
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
