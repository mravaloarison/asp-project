"use client";

import {
	Flex,
	Avatar,
	Heading,
	Separator,
	Text,
	TextField,
} from "@radix-ui/themes";
import { PersonIcon, BackpackIcon, SewingPinIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import UserCard from "@/components/dashboard-user-card";
import ZoneCard from "@/components/dashboard-zone-card";

interface UserData {
	name: string;
	company: string;
}

interface DashboardBodyContentProps {
	viewState: string;
	currentSegment: string;
	selectedZoneName: string | undefined;
	zoneId: string | undefined;
	selectedUserData: UserData | undefined;
	navigateToZone: (id: number) => void;
	navigateToUserFromList: (id: number) => void;
	navigateToUserFromZone: (zoneId: string, userId: number) => void;
}

export default function DashboardBodyContent({
	viewState,
	currentSegment,
	selectedZoneName,
	zoneId,
	selectedUserData,
	navigateToZone,
	navigateToUserFromList,
	navigateToUserFromZone,
}: DashboardBodyContentProps) {
	const router = useRouter();

	switch (viewState) {
		case "MAIN_DASHBOARD":
			if (!currentSegment) {
				router.replace("/dashboard/user");
			}
			return null;

		case "MAIN_LIST":
			return (
				<Flex gap="3" direction="column" pt="3">
					{currentSegment === "users"
						? [...Array(12)].map((_, i) => (
								<div
									key={i}
									onClick={() =>
										navigateToUserFromList(i + 1)
									}
								>
									<UserCard
										name={`User ${i + 1}`}
										company={`Company ${i + 1}`}
										department="Urban Development"
										locations={2}
										avatarFallback="U"
									/>
								</div>
						  ))
						: [...Array(4)].map((_, i) => (
								<div
									key={i}
									onClick={() => navigateToZone(i + 1)}
								>
									<ZoneCard
										ZoneName={`Zone ${i + 1}`}
										numberOfUsers={Math.floor(
											Math.random() * 100
										)}
										numberOfLocations={Math.floor(
											Math.random() * 20
										)}
									/>
								</div>
						  ))}
				</Flex>
			);

		case "ZONE_MEMBERS":
			return (
				<Flex direction="column" gap="3" pt="3">
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							onClick={() =>
								navigateToUserFromZone(zoneId!, i + 1)
							}
						>
							<UserCard
								name={`Zone User ${i + 1}`}
								company={selectedZoneName || "Company"}
								department="Field Ops"
								locations={1}
								avatarFallback={`Z${i}`}
							/>
						</div>
					))}
				</Flex>
			);

		case "USER_READ_ONLY":
		case "ZONE_USER_READ_ONLY":
			const user = selectedUserData;
			return (
				<Flex direction="column" gap="4" pt="3">
					<Flex align="center" gap="4">
						<Avatar
							size="5"
							fallback={user?.name?.[0] || "U"}
							variant="solid"
							color="indigo"
						/>
						<Flex direction="column">
							<Heading size="3">{user?.name}</Heading>
							<Text color="gray" size="2">
								Connected User
							</Text>
						</Flex>
					</Flex>
					<Separator size="4" />
					<Flex direction="column" gap="3">
						<label>
							<Text size="2" weight="bold" color="gray">
								Full Name
							</Text>
							<TextField.Root
								size="3"
								variant="surface"
								value={user?.name || ""}
								readOnly
								style={{
									pointerEvents: "none",
									backgroundColor: "var(--gray-3)",
								}}
							>
								<TextField.Slot>
									<PersonIcon />
								</TextField.Slot>
							</TextField.Root>
						</label>
						<label>
							<Text size="2" weight="bold" color="gray">
								Company
							</Text>
							<TextField.Root
								size="3"
								variant="surface"
								value={user?.company || ""}
								readOnly
								style={{
									pointerEvents: "none",
									backgroundColor: "var(--gray-3)",
								}}
							>
								<TextField.Slot>
									<BackpackIcon />
								</TextField.Slot>
							</TextField.Root>
						</label>
						<label>
							<Text size="2" weight="bold" color="gray">
								Assigned Zone
							</Text>
							<TextField.Root
								size="3"
								variant="surface"
								value={selectedZoneName || "General Region"}
								readOnly
								style={{
									pointerEvents: "none",
									backgroundColor: "var(--gray-3)",
								}}
							>
								<TextField.Slot>
									<SewingPinIcon />
								</TextField.Slot>
							</TextField.Root>
						</label>
					</Flex>
				</Flex>
			);
		default:
			return null;
	}
}
