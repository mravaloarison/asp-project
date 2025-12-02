"use client";

import { Flex, Heading, Button } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import LocationItem from "./location-item";
import { Location } from "../types";

interface LocationListProps {
	locations: Location[];
	onAddLocation: () => void;
	onUpdateLocation: (updatedLoc: Location) => void;
	onDeleteLocation: (id: number) => void;
}

export default function LocationList({
	locations,
	onAddLocation,
	onUpdateLocation,
	onDeleteLocation,
}: LocationListProps) {
	return (
		<Flex
			direction="column"
			gap="3"
			flexGrow="1"
			minHeight="0"
			overflowY="auto"
		>
			<Flex justify="between" align="center" style={{ flexShrink: 0 }}>
				<Heading size="4">
					Your Operating Locations ({locations.length})
				</Heading>
				<Button variant="outline" size="2" onClick={onAddLocation}>
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
				{locations.map((loc) => (
					<LocationItem
						key={loc.id}
						location={loc}
						onUpdate={onUpdateLocation}
						onDelete={onDeleteLocation}
					/>
				))}
				{locations.length === 0 && (
					<Flex
						align="center"
						justify="center"
						p="5"
						style={{
							border: "1px dashed var(--gray-5)",
							borderRadius: "var(--radius-3)",
						}}
					>
						No locations found. Click add to start.
					</Flex>
				)}
			</Flex>
		</Flex>
	);
}
