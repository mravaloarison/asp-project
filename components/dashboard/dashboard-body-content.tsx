"use client";

import {
	Flex,
	Avatar,
	Heading,
	Separator,
	Text,
	TextField,
	Box,
	Card,
	Badge,
} from "@radix-ui/themes";
import { PersonIcon, BackpackIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import UserCard from "@/components/dashboard-user-card";
import ZoneCard from "@/components/dashboard-zone-card";
import { UserDocument, ZoneDocument } from "@/app/firestore";

interface DashboardBodyContentProps {
	viewState: string;
	currentSegment: string;
	selectedZoneName: string | undefined;
	zoneId: string | undefined;
	selectedUser: UserDocument | undefined;
	users: UserDocument[];
	zones: ZoneDocument[];
	navigateToZone: (id: string) => void;
	navigateToUserFromList: (id: string) => void;
	navigateToUserFromZone: (zoneId: string, userId: string) => void;
}

export default function DashboardBodyContent({
	viewState,
	currentSegment,
	zoneId,
	selectedUser,
	users,
	zones,
	navigateToZone,
	navigateToUserFromList,
	navigateToUserFromZone,
}: DashboardBodyContentProps) {
	const router = useRouter();

	const getUserLocationCount = (uid: string) => {
		return zones.filter((z) => z.assignedUserIds?.includes(uid)).length;
	};

	const getUserLocations = (uid: string) => {
		return zones.filter((z) => z.assignedUserIds?.includes(uid));
	};

	switch (viewState) {
		case "MAIN_DASHBOARD":
			if (!currentSegment) {
				router.replace("/dashboard/user");
			}
			return null;

		case "MAIN_LIST":
			return (
				<Flex gap="3" direction="column" pt="1">
					{currentSegment === "users"
						? users.map((user) => (
								<div
									key={user.uid}
									onClick={() =>
										navigateToUserFromList(user.uid)
									}
									style={{ cursor: "pointer" }}
								>
									<UserCard
										name={user.displayName}
										company={user.companyName}
										department={user.department || "Agent"}
										locations={getUserLocationCount(
											user.uid
										)}
										avatarFallback={
											user.displayName?.[0] || "U"
										}
									/>
								</div>
						  ))
						: zones.map((zone) => (
								<div
									key={zone.id}
									onClick={() => navigateToZone(zone.id)}
									style={{ cursor: "pointer" }}
								>
									<ZoneCard
										ZoneName={zone.name}
										numberOfUsers={
											zone.assignedUserIds?.length || 0
										}
									/>
								</div>
						  ))}
					{currentSegment === "users" && users.length === 0 && (
						<Text align="center" color="gray" size="2">
							No users found.
						</Text>
					)}
					{currentSegment === "zones" && zones.length === 0 && (
						<Text align="center" color="gray" size="2">
							No zones found.
						</Text>
					)}
				</Flex>
			);

		case "ZONE_MEMBERS":
			const zoneUsers = users.filter((u) =>
				u.assignedZoneIds?.includes(zoneId || "")
			);

			return (
				<Flex direction="column" gap="3" pt="1">
					{zoneUsers.map((user) => (
						<div key={user.uid} style={{ cursor: "default" }}>
							<UserCard
								name={user.displayName}
								company={user.companyName}
								department={user.department || "Agent"}
								locations={getUserLocationCount(user.uid)}
								avatarFallback={user.displayName?.[0] || "U"}
							/>
						</div>
					))}
					{zoneUsers.length === 0 && (
						<Text align="center" color="gray" size="2">
							No agents assigned to this zone.
						</Text>
					)}
				</Flex>
			);

		case "USER_READ_ONLY":
		case "ZONE_USER_READ_ONLY":
			const user = selectedUser;
			const userLocs = user ? getUserLocations(user.uid) : [];

			const formatDate = (timestamp: number) => {
				return new Date(timestamp).toLocaleDateString("en-US", {
					month: "short",
					year: "numeric",
				});
			};

			return (
				<Flex direction="column" gap="4" pt="1">
					<Flex align="center" gap="4">
						<Avatar
							size="5"
							fallback={user?.displayName?.[0] || "U"}
						/>
						<Flex direction="column">
							<Heading size="3">{user?.displayName}</Heading>
							<Text color="gray" size="2">
								Member since {formatDate(user?.createdAt || 0)}
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
								value={user?.displayName || ""}
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
								value={user?.companyName || ""}
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
						<Box>
							<Text
								size="2"
								weight="bold"
								color="gray"
								mb="2"
								as="div"
							>
								Assigned Locations ({userLocs.length})
							</Text>
							<Flex direction="column" gap="2">
								{userLocs.map((location) => (
									<Card
										key={location.id}
										className="user-card-hover-effect"
										onClick={() => {
											console.log("Update map");
										}}
									>
										<Flex direction="column" gap="2">
											<Flex
												justify="between"
												align="start"
											>
												<Text size="3" weight="medium">
													{location.name}
												</Text>
												{location.coordinates && (
													<Badge
														size="1"
														color="violet"
													>
														{location.coordinates.lat.toFixed(
															4
														)}
														,{" "}
														{location.coordinates.lng.toFixed(
															4
														)}
													</Badge>
												)}
											</Flex>
											<Text size="2" color="gray">
												{location.description
													? location.description
													: "No description"}
											</Text>
											{location.description && (
												<Text
													size="2"
													style={{
														fontStyle: "italic",
													}}
												>
													{location.description}
												</Text>
											)}
										</Flex>
									</Card>
								))}
								{userLocs.length === 0 && (
									<Text
										size="2"
										color="gray"
										style={{ fontStyle: "italic" }}
									>
										No locations assigned.
									</Text>
								)}
							</Flex>
						</Box>
					</Flex>
				</Flex>
			);
		default:
			return null;
	}
}
