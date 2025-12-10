"use client";

import { Dialog, Button, Flex, Progress, Text, Avatar } from "@radix-ui/themes";
import { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import {
	addDoc,
	collection,
	getFirestore,
	doc,
	getDoc,
	updateDoc,
	setDoc,
	increment,
} from "firebase/firestore";
import { CheckIcon } from "@radix-ui/react-icons";
import StepSearch from "./location-search";
import StepPin from "./location-pin";
import StepDetails from "./location-details";
import { DialogTitle } from "@radix-ui/react-dialog";

const LIBRARIES: "places"[] = ["places"];

interface AddLocationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userId: string;
	onLocationAdded: (newLoc: any) => void;
}

const extractZoneFromAddress = (address: string) => {
	if (!address) return "Unknown Zone";
	const parts = address.split(",");
	// Heuristic: usually the 2nd to last part is the city/region in Google Maps formatted address
	if (parts.length >= 2) {
		return parts[parts.length - 2].trim();
	}
	return parts[0].trim();
};

export default function AddLocationDialog({
	open,
	onOpenChange,
	userId,
	onLocationAdded,
}: AddLocationDialogProps) {
	const db = getFirestore();
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: LIBRARIES,
	});

	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);

	const [coords, setCoords] = useState({ lat: -18.8792, lng: 47.5079 });
	const [address, setAddress] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const reset = () => {
		setStep(1);
		setName("");
		setAddress("");
		setDescription("");
		setCoords({ lat: -18.8792, lng: 47.5079 });
	};

	const handlePlaceSelected = (
		lat: number,
		lng: number,
		addr: string,
		placeName: string
	) => {
		setCoords({ lat, lng });
		setAddress(addr);
		setName(placeName);
		setStep(2);
	};

	const handlePinDrag = (lat: number, lng: number) => {
		setCoords({ lat, lng });
	};

	const handleSave = async () => {
		if (!name || !userId) return;
		setLoading(true);
		try {
			const zone = extractZoneFromAddress(address);

			const newLocData = {
				name,
				userId,
				address,
				description,
				zone,
				coordinates: coords,
			};

			const docRef = await addDoc(
				collection(db, "locations"),
				newLocData
			);

			const zoneId = zone.toLowerCase().replace(/\s+/g, "-");
			const zoneRef = doc(db, "zones", zoneId);
			const zoneSnap = await getDoc(zoneRef);

			if (zoneSnap.exists()) {
				const currentUserIds = zoneSnap.data().assignedUserIds || [];
				if (!currentUserIds.includes(userId)) {
					await updateDoc(zoneRef, {
						assignedUserIds: [...currentUserIds, userId],
						locationCount: increment(1),
					});
				} else {
					await updateDoc(zoneRef, {
						locationCount: increment(1),
					});
				}
			} else {
				await setDoc(zoneRef, {
					name: zone,
					region: "Madagascar",
					assignedUserIds: [userId],
					locationCount: 1,
				});
			}

			const userRef = doc(db, "users", userId);
			const userSnap = await getDoc(userRef);
			if (userSnap.exists()) {
				const currentZoneIds = userSnap.data().assignedZoneIds || [];
				if (!currentZoneIds.includes(zoneId)) {
					await updateDoc(userRef, {
						assignedZoneIds: [...currentZoneIds, zoneId],
					});
				}
			}

			onLocationAdded({ id: docRef.id, ...newLocData });
			onOpenChange(false);
			reset();
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (!isLoaded) return null;

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(v) => {
				if (!v) reset();
				onOpenChange(v);
			}}
		>
			<Dialog.Content style={{ maxWidth: 600 }}>
				<DialogTitle>Add New Operating Location</DialogTitle>
				<Flex justify="center" align="center" gap="2" my="4">
					<Flex direction="column" align="center" gap="1">
						<Avatar
							size="2"
							variant={step >= 1 ? "solid" : "soft"}
							fallback={
								step > 1 ? (
									<CheckIcon width="14" height="14" />
								) : (
									"1"
								)
							}
						/>
						<Text size="1">Search</Text>
					</Flex>

					<Progress
						value={step > 1 ? 100 : 0}
						style={{ width: 60, marginTop: -20 }}
					/>

					<Flex direction="column" align="center" gap="1">
						<Avatar
							size="2"
							variant={step >= 2 ? "solid" : "soft"}
							fallback={
								step > 2 ? (
									<CheckIcon width="14" height="14" />
								) : (
									"2"
								)
							}
						/>
						<Text size="1">Pin</Text>
					</Flex>

					<Progress
						value={step > 2 ? 100 : 0}
						style={{ width: 60, marginTop: -20 }}
					/>

					<Flex direction="column" align="center" gap="1">
						<Avatar
							size="2"
							variant={step >= 3 ? "solid" : "soft"}
							fallback="3"
						/>
						<Text size="1">Details</Text>
					</Flex>
				</Flex>

				<div style={{ minHeight: 320 }}>
					{step === 1 && (
						<StepSearch onPlaceSelected={handlePlaceSelected} />
					)}
					{step === 2 && (
						<StepPin
							lat={coords.lat}
							lng={coords.lng}
							onDragEnd={handlePinDrag}
						/>
					)}
					{step === 3 && (
						<StepDetails
							name={name}
							setName={setName}
							description={description}
							setDescription={setDescription}
						/>
					)}
				</div>

				<Flex gap="3" mt="4" justify="end">
					{step === 1 && (
						<Dialog.Close>
							<Button variant="soft" color="gray">
								Cancel
							</Button>
						</Dialog.Close>
					)}

					{step > 1 && (
						<Button
							variant="soft"
							color="gray"
							onClick={() => setStep((s) => s - 1)}
						>
							Back
						</Button>
					)}

					{step === 2 && (
						<Button onClick={() => setStep(3)}>Next</Button>
					)}

					{step === 3 && (
						<Button onClick={handleSave} disabled={loading}>
							{loading ? "Saving..." : "Save Location"}
						</Button>
					)}
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
}
