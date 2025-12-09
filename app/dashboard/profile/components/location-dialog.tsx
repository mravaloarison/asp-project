"use client";

import { Dialog, Button, Flex, Progress, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { ZoneDocument } from "@/app/firestore";
import StepSearch from "./location-search";
import StepPin from "./location-pin";
import StepDetails from "./location-details";

const LIBRARIES: "places"[] = ["places"];

interface AddLocationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	zones: ZoneDocument[];
	onLocationAdded: (newLoc: any) => void;
}

export default function AddLocationDialog({
	open,
	onOpenChange,
	zones,
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
	const [zoneId, setZoneId] = useState("");

	const reset = () => {
		setStep(1);
		setName("");
		setAddress("");
		setDescription("");
		setZoneId("");
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
		if (!name || !zoneId) return;
		setLoading(true);

		try {
			const newLocData = {
				name,
				address,
				description,
				zoneId,
				coordinates: coords,
			};
			const docRef = await addDoc(
				collection(db, "locations"),
				newLocData
			);
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

	const progressValue = (step / 3) * 100;

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(v) => {
				if (!v) reset();
				onOpenChange(v);
			}}
		>
			<Dialog.Content style={{ maxWidth: 500 }}>
				<Flex justify="between" align="center" mb="4">
					<Dialog.Title style={{ margin: 0 }}>
						Add New Location
					</Dialog.Title>
					<Text size="1" color="gray">
						Step {step} of 3
					</Text>
				</Flex>

				<Progress value={progressValue} mb="4" />

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
							zoneId={zoneId}
							setZoneId={setZoneId}
							zones={zones}
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
						<Button
							onClick={handleSave}
							disabled={loading || !zoneId}
						>
							{loading ? "Saving..." : "Save Location"}
						</Button>
					)}
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
}
