"use client";

import {
	Container,
	Card,
	Flex,
	Separator,
	Box,
	Text,
	Button,
} from "@radix-ui/themes";
import { useState } from "react";
import ProfileDetails from "./components/profile-details";
import LocationList from "./components/location-list";
import { Location } from "./types";

const mockLocationsData: Location[] = [
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
	const [locations, setLocations] = useState<Location[]>(mockLocationsData);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);

	const handleProfileSave = (name: string, company: string) => {
		console.log("Saving to firebase:", { name, company });
		showStatus("Profile updated successfully!");
	};

	const handleDeleteAccount = () => {
		console.log("Delete account triggered");
	};

	const handleAddLocationClick = () => {
		console.log("Navigating to Add View...");
	};

	const handleUpdateLocation = (updatedLoc: Location) => {
		setLocations((prev) =>
			prev.map((loc) => (loc.id === updatedLoc.id ? updatedLoc : loc))
		);
		showStatus("Location updated!");
	};

	const handleDeleteLocation = (id: number) => {
		setLocations((prev) => prev.filter((loc) => loc.id !== id));
		showStatus("Location deleted.");
	};

	const showStatus = (msg: string) => {
		setStatusMessage(msg);
		setTimeout(() => setStatusMessage(null), 3000);
	};

	const content = () => {
		return (
			<Flex
				direction="column"
				gap="3"
				style={{ flexGrow: 1, minHeight: 0 }}
			>
				{statusMessage && (
					<Box>
						<Text weight="medium" color="green">
							{statusMessage}
						</Text>
					</Box>
				)}

				<ProfileDetails
					initialName="John Doe"
					initialCompany="Acme Corp"
					onSave={handleProfileSave}
				/>

				<Separator size="4" style={{ flexShrink: 0 }} />

				<LocationList
					locations={locations}
					onAddLocation={handleAddLocationClick}
					onUpdateLocation={handleUpdateLocation}
					onDeleteLocation={handleDeleteLocation}
				/>

				<Separator size="4" style={{ flexShrink: 0 }} />

				<Flex direction="column" gap="3" style={{ flexShrink: 0 }}>
					<Button
						size="3"
						onClick={handleDeleteAccount}
						variant="soft"
						color="red"
					>
						Delete Account
					</Button>
				</Flex>
			</Flex>
		);
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
				{content()}
			</Card>
		</Container>
	);
}
