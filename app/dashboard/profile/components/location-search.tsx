"use client";

import { Flex, Text, TextField, Card, Box } from "@radix-ui/themes";
import { MagnifyingGlassIcon, SewingPinIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";

interface StepSearchProps {
	onPlaceSelected: (
		lat: number,
		lng: number,
		address: string,
		name: string
	) => void;
}

export default function StepSearch({ onPlaceSelected }: StepSearchProps) {
	const [input, setInput] = useState("");
	const [predictions, setPredictions] = useState<
		google.maps.places.AutocompletePrediction[]
	>([]);
	const [service, setService] =
		useState<google.maps.places.AutocompleteService | null>(null);

	useEffect(() => {
		if (window.google && !service) {
			setService(new window.google.maps.places.AutocompleteService());
		}
	}, [service]);

	useEffect(() => {
		if (!input || !service) {
			setPredictions([]);
			return;
		}

		const delayDebounceFn = setTimeout(() => {
			service.getPlacePredictions(
				{
					input,
					componentRestrictions: { country: "mg" },
					types: ["establishment", "geocode"],
				},
				(results) => setPredictions(results || [])
			);
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [input, service]);

	const handleSelect = (placeId: string, mainText: string) => {
		const placesService = new window.google.maps.places.PlacesService(
			document.createElement("div")
		);

		placesService.getDetails({ placeId }, (place, status) => {
			if (
				status === window.google.maps.places.PlacesServiceStatus.OK &&
				place &&
				place.geometry &&
				place.geometry.location
			) {
				onPlaceSelected(
					place.geometry.location.lat(),
					place.geometry.location.lng(),
					place.formatted_address || "",
					place.name || mainText
				);
			}
		});
	};

	return (
		<Flex
			direction="column"
			gap="4"
			style={{ minHeight: "300px" }}
			justify="start"
			position="relative"
		>
			<Text align="center" size="3" mt="2">
				Search for a region or place in Madagascar
			</Text>

			<Box style={{ position: "relative", zIndex: 20 }}>
				<TextField.Root
					size="3"
					placeholder="Search places..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
				>
					<TextField.Slot>
						<MagnifyingGlassIcon height="16" width="16" />
					</TextField.Slot>
				</TextField.Root>

				{predictions.length > 0 && (
					<div
						style={{
							position: "absolute",
							top: "100%",
							left: 0,
							right: 0,
							marginTop: "8px",
							maxHeight: "200px",
							overflowY: "scroll",
							padding: 0,
							zIndex: 100,
						}}
					>
						<Flex direction="column">
							{predictions.map((p) => (
								<Box
									key={p.place_id}
									onClick={() =>
										handleSelect(
											p.place_id,
											p.structured_formatting.main_text
										)
									}
									style={{
										padding: "12px",
										cursor: "pointer",
										borderBottom: "1px solid var(--gray-4)",
										transition: "background 0.2s",
									}}
									className="hover:bg-gray-100 dark:hover:bg-gray-800"
								>
									<Flex align="center" gap="3">
										<SewingPinIcon />
										<Flex direction="column">
											<Text size="2" weight="bold">
												{
													p.structured_formatting
														.main_text
												}
											</Text>
											<Text size="1" color="gray">
												{
													p.structured_formatting
														.secondary_text
												}
											</Text>
										</Flex>
									</Flex>
								</Box>
							))}
						</Flex>
					</div>
				)}
			</Box>
		</Flex>
	);
}
