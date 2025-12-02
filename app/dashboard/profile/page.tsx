"use client";

import {
	Container,
	Flex,
	Heading,
	Card,
	Text,
	TextField,
	Button,
	Separator,
	Box,
} from "@radix-ui/themes";
import {
	PersonIcon,
	PlusIcon,
	Pencil2Icon,
	TrashIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";

interface Location {
	id: number;
	name: string;
	region: string;
	coords: string;
}

const mockLocations: Location[] = [
	{
		id: 1,
		name: "New York Office",
		region: "North America",
		coords: "40.7128, -74.0060",
	},
	{
		id: 2,
		name: "Times Square Site",
		region: "North America",
		coords: "40.7589, -73.9851",
	},
];

export default function ProfilePage() {
	const [name, setName] = useState("John Doe");
	const [company, setCompany] = useState("Acme Corp");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);

	const handleUpdateProfile = () => {
		setStatusMessage("Profile updated successfully!");
		setTimeout(() => setStatusMessage(null), 3000);
	};

	const handleChangePassword = () => {
		if (newPassword !== confirmNewPassword) {
			setStatusMessage("Error: New passwords do not match.");
			return;
		}
		if (!oldPassword || !newPassword) {
			setStatusMessage("Error: Please fill out all password fields.");
			return;
		}

		setStatusMessage("Password updated successfully!");
		setOldPassword("");
		setNewPassword("");
		setConfirmNewPassword("");
		setTimeout(() => setStatusMessage(null), 3000);
	};

	const handleEditLocation = (locationId: number) => {
		console.log(`Editing location ID: ${locationId}`);
	};

	const handleDeleteLocation = (locationId: number) => {
		console.log(`Deleting location ID: ${locationId}`);
	};

	return (
		<Container
			p="4"
			size="1"
			style={{
				flexGrow: 1,
				minHeight: 0,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Card
				size="2"
				style={{
					flexGrow: 1,
					minHeight: 0,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Flex
					direction="column"
					gap="3"
					style={{ flexGrow: 1, minHeight: 0 }}
				>
					{statusMessage && (
						<Box>
							<Text
								weight="medium"
								color={
									statusMessage.startsWith("Error")
										? "red"
										: "green"
								}
							>
								{statusMessage}
							</Text>
						</Box>
					)}

					<Flex direction="column" gap="3" style={{ flexShrink: 0 }}>
						<Heading size="4">Personal Information</Heading>
						<TextField.Root
							size="3"
							placeholder="Full Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						>
							<TextField.Slot>
								<PersonIcon height="16" width="16" />
							</TextField.Slot>
						</TextField.Root>
						<TextField.Root
							size="3"
							placeholder="Company Name"
							value={company}
							onChange={(e) => setCompany(e.target.value)}
						>
							<TextField.Slot>
								<Pencil2Icon height="16" width="16" />
							</TextField.Slot>
						</TextField.Root>
						<Button
							size="3"
							onClick={handleUpdateProfile}
							disabled={loading}
						>
							{loading ? "Saving..." : "Save Profile Changes"}
						</Button>
					</Flex>

					<Separator size="4" style={{ flexShrink: 0 }} />

					<Flex
						direction="column"
						gap="3"
						flexGrow="1"
						minHeight="0"
						overflowY="auto"
					>
						<Flex
							justify="between"
							align="center"
							style={{ flexShrink: 0 }}
						>
							<Flex gap="2" align="center">
								<Heading size="4">
									Your Operating Locations (
									{mockLocations.length})
								</Heading>
							</Flex>
							<Button variant="outline" size="2">
								<PlusIcon /> Add
							</Button>
						</Flex>

						<Flex
							direction="column"
							gap="3"
							flexGrow="1"
							minHeight="0"
							overflowY="auto"
							maxHeight="350px"
						>
							{mockLocations.map((loc) => (
								<Box
									key={loc.id}
									p="3"
									style={{
										border: "1px solid var(--gray-6)",
										backgroundColor: "var(--gray-2)",
										borderRadius: "var(--radius-3)",
										flexShrink: 0,
									}}
								>
									<Flex justify="between" align="start">
										<Box>
											<Text size="3" weight="medium">
												{loc.name}
											</Text>
											<Flex align="center" gap="2" mt="1">
												<Text size="2" color="gray">
													{loc.coords}
												</Text>
											</Flex>
										</Box>

										{/* Action Buttons */}
										<Flex direction="column" gap="3">
											<Button
												variant="ghost"
												size="2"
												onClick={() =>
													handleEditLocation(loc.id)
												}
												title="Edit Location"
											>
												<Pencil2Icon />
											</Button>
											<Button
												variant="ghost"
												color="red"
												size="2"
												onClick={() =>
													handleDeleteLocation(loc.id)
												}
												title="Delete Location"
											>
												<TrashIcon />
											</Button>
										</Flex>
									</Flex>
								</Box>
							))}
						</Flex>
					</Flex>

					<Separator size="4" style={{ flexShrink: 0 }} />

					<Flex direction="column" gap="3" style={{ flexShrink: 0 }}>
						<Button
							size="3"
							onClick={handleChangePassword}
							disabled={loading}
							variant="soft"
							color="red"
						>
							Delete Account
						</Button>
					</Flex>
				</Flex>
			</Card>
		</Container>
	);
}
