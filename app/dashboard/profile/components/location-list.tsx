"use client";

import { Flex, Heading, Button, Text } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import {
	collection,
	query,
	where,
	getDocs,
	deleteDoc,
	doc,
	updateDoc,
	getFirestore,
	documentId,
} from "firebase/firestore";
import LocationItem from "./location-item";
import { LocationDocument, ZoneDocument } from "@/app/firestore";
import AddLocationDialog from "./location-dialog";

interface LocationListProps {
	assignedZoneIds: string[];
}

export default function LocationList({ assignedZoneIds }: LocationListProps) {
	const db = getFirestore();
	const [locations, setLocations] = useState<LocationDocument[]>([]);
	const [zones, setZones] = useState<ZoneDocument[]>([]);
	const [loading, setLoading] = useState(false);
	const [isAddOpen, setIsAddOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			if (assignedZoneIds.length === 0) return;
			setLoading(true);
			try {
				const zonesRef = collection(db, "zones");
				const zonesQuery = query(
					zonesRef,
					where(documentId(), "in", assignedZoneIds)
				);
				const zoneSnaps = await getDocs(zonesQuery);
				const loadedZones = zoneSnaps.docs.map(
					(doc) => ({ id: doc.id, ...doc.data() } as ZoneDocument)
				);
				setZones(loadedZones);

				const locsRef = collection(db, "locations");
				const locsQuery = query(
					locsRef,
					where("zoneId", "in", assignedZoneIds)
				);
				const locSnaps = await getDocs(locsQuery);
				const loadedLocs = locSnaps.docs.map(
					(doc) => ({ id: doc.id, ...doc.data() } as LocationDocument)
				);
				setLocations(loadedLocs);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [assignedZoneIds, db]);

	const handleLocationAdded = (newLoc: LocationDocument) => {
		setLocations((prev) => [...prev, newLoc]);
	};

	const handleDeleteLocation = async (id: string) => {
		try {
			await deleteDoc(doc(db, "locations", id));
			setLocations((prev) => prev.filter((loc) => loc.id !== id));
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdateLocation = async (updatedLoc: LocationDocument) => {
		try {
			const { id, ...data } = updatedLoc;
			await updateDoc(doc(db, "locations", id), data);
			setLocations((prev) =>
				prev.map((loc) => (loc.id === id ? updatedLoc : loc))
			);
		} catch (error) {
			console.error(error);
		}
	};

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

				<Button
					variant="outline"
					size="2"
					onClick={() => setIsAddOpen(true)}
				>
					<PlusIcon /> Add
				</Button>

				<AddLocationDialog
					open={isAddOpen}
					onOpenChange={setIsAddOpen}
					zones={zones}
					onLocationAdded={handleLocationAdded}
				/>
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
						onUpdate={handleUpdateLocation}
						onDelete={() => handleDeleteLocation(loc.id)}
					/>
				))}
				{!loading && locations.length === 0 && (
					<Flex
						align="center"
						justify="center"
						p="5"
						style={{
							border: "1px dashed var(--gray-5)",
							borderRadius: "var(--radius-3)",
						}}
					>
						<Text color="gray">
							No locations found. Click add to start.
						</Text>
					</Flex>
				)}
			</Flex>
		</Flex>
	);
}
