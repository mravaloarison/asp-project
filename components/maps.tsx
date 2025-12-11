"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Flex, Heading, Text, Badge } from "@radix-ui/themes";
import { usePathname } from "next/navigation";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { getAllUsers, getAllZones } from "@/app/firestore-fetch";
import { UserDocument, ZoneDocument } from "@/app/firestore";
import { useDashboardSelection } from "@/hooks/dashboard-selection-context";

const DEFAULT_CENTER = { lat: 39.8097343, lng: -98.5556199 }; // Geographic center of continental US

const mapOptions: google.maps.MapOptions = {
	mapTypeControl: false,
	streetViewControl: false,
	fullscreenControl: false,
	gestureHandling: "greedy",
	styles: [
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [{ visibility: "off" }],
		},
	],
};

const getSegments = (pathname: string) => pathname.split("/").filter(Boolean);

export default function Maps() {
	const pathname = usePathname();
	const segments = getSegments(pathname);
	const [zones, setZones] = useState<ZoneDocument[]>([]);
	const [users, setUsers] = useState<UserDocument[]>([]);
	const [loadingData, setLoadingData] = useState(true);
	const [fetchError, setFetchError] = useState<string | null>(null);
	const { focusedLocationId, setFocusedLocationId } =
		useDashboardSelection();

	const { isLoaded, loadError } = useJsApiLoader({
		id: "dashboard-map-script",
		googleMapsApiKey:
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
	});

	useEffect(() => {
		let ignore = false;
		async function loadData() {
			setLoadingData(true);
			setFetchError(null);
			try {
				const [zonesRes, usersRes] = await Promise.all([
					getAllZones(),
					getAllUsers(),
				]);
				if (!ignore) {
					setZones(zonesRes);
					setUsers(usersRes);
				}
			} catch (error) {
				console.error("Failed to load map data", error);
				if (!ignore) {
					setFetchError("Unable to load location data.");
				}
			} finally {
				if (!ignore) {
					setLoadingData(false);
				}
			}
		}
		loadData();
		return () => {
			ignore = true;
		};
	}, []);

	const selectedZoneId =
		segments[1] === "zone" && segments[2] ? segments[2] : undefined;
	let selectedUserId: string | undefined;
	if (segments[1] === "user" && segments[2]) {
		selectedUserId = segments[2];
	} else if (segments.length >= 5 && segments[3] === "user") {
		selectedUserId = segments[4];
	}

	const selectedUser = users.find((u) => u.uid === selectedUserId);
	const selectedUserName = selectedUser?.displayName || "this agent";

	const zonesWithCoords = useMemo(
		() => zones.filter((z) => z.coordinates),
		[zones]
	);

	const visibleZones = useMemo(() => {
		let list = zonesWithCoords;
		if (selectedZoneId) {
			list = list.filter((z) => z.id === selectedZoneId);
		}
		if (selectedUserId) {
			list = list.filter((z) =>
				Array.isArray(z.assignedUserIds)
					? z.assignedUserIds.includes(selectedUserId as string)
					: false
			);
		}
		return list;
	}, [zonesWithCoords, selectedZoneId, selectedUserId]);

	const activeZone = useMemo(
		() => zones.find((z) => z.id === focusedLocationId),
		[zones, focusedLocationId]
	);

	const mapCenter = useMemo(() => {
		if (activeZone?.coordinates) {
			return activeZone.coordinates;
		}
		const target = visibleZones.length ? visibleZones : zonesWithCoords;
		if (target.length === 0) {
			return DEFAULT_CENTER;
		}
		const avg = target.reduce(
			(acc, zone) => {
				if (!zone.coordinates) return acc;
				return {
					lat: acc.lat + zone.coordinates.lat,
					lng: acc.lng + zone.coordinates.lng,
				};
			},
			{ lat: 0, lng: 0 }
		);
		return {
			lat: avg.lat / target.length,
			lng: avg.lng / target.length,
		};
	}, [activeZone, visibleZones, zonesWithCoords]);

	const mapZoom = activeZone
		? 11
		: selectedUserId || selectedZoneId
		? 6
		: 4;

	const mapDescription = useMemo(() => {
		if (selectedUser) {
			return `Viewing ${selectedUserName}'s assigned locations`;
		}
		if (selectedZoneId && visibleZones.length === 1) {
			return `Showing details for ${visibleZones[0].name}`;
		}
		return "Active zones overview";
	}, [selectedUser, selectedZoneId, visibleZones]);

	const handleMarkerClick = (zoneId: string) => {
		setFocusedLocationId(zoneId);
	};

	const handleMapClick = () => {
		setFocusedLocationId(null);
	};

	useEffect(() => {
		if (!focusedLocationId) {
			return;
		}
		if (visibleZones.some((zone) => zone.id === focusedLocationId)) {
			return;
		}
		setFocusedLocationId(visibleZones[0]?.id ?? null);
	}, [focusedLocationId, visibleZones, setFocusedLocationId]);

	const renderMap = () => {
		if (loadError) {
			return (
				<Text color="red" size="2">
					Unable to load Google Maps. Check your API key.
				</Text>
			);
		}
		if (!isLoaded) {
			return (
				<Text color="gray" size="2">
					Loading map...
				</Text>
			);
		}
		if (!visibleZones.length && !activeZone) {
			return (
				<Text color="gray" size="2">
					{selectedUser
						? "This user has no mapped locations yet."
						: "No locations available."}
				</Text>
			);
		}

		const pins = visibleZones.length ? visibleZones : zonesWithCoords;

		return (
			<GoogleMap
				mapContainerStyle={{ width: "100%", height: "100%" }}
				zoom={mapZoom}
				center={mapCenter}
				options={mapOptions}
				onClick={handleMapClick}
			>
				{pins.map((zone) =>
					zone.coordinates ? (
						<MarkerF
							key={zone.id}
							position={zone.coordinates}
							label={{
								text: zone.name,
								className:
									"dashboard-map-marker-label" +
								(activeZone?.id === zone.id
									? " dashboard-map-marker-label--active"
									: ""),
							}}
							icon={{
								path: google.maps.SymbolPath.CIRCLE,
								scale: activeZone?.id === zone.id ? 10 : 7,
								fillColor: activeZone?.id === zone.id
									? "#7c3aed"
									: selectedUserId
									? "#1d4ed8"
									: "#111827",
								fillOpacity: 0.9,
								strokeWeight: 2,
								strokeColor: "white",
							}}
							onClick={() => handleMarkerClick(zone.id)}
						/>
					) : null
					)}
				{activeZone?.coordinates && (
					<InfoWindowF
						position={activeZone.coordinates}
						onCloseClick={() => setFocusedLocationId(null)}
					>
						<Flex direction="column" gap="1">
							<Text weight="bold">{activeZone.name}</Text>
							{activeZone.region && (
								<Text size="2" color="gray">
									{activeZone.region}
								</Text>
							)}
							{activeZone.description && (
								<Text size="2">{activeZone.description}</Text>
							)}
							<Text size="2" color="gray">
								{activeZone.coordinates.lat.toFixed(4)},
								{activeZone.coordinates.lng.toFixed(4)}
							</Text>
							{activeZone.assignedUserIds?.length ? (
								<Flex gap="1" wrap="wrap">
									{activeZone.assignedUserIds.map((uid) => {
										const u = users.find((user) => user.uid === uid);
										return (
											<Badge key={uid} color="indigo" size="1">
												{u?.displayName || "Unassigned"}
											</Badge>
										);
									})}
								</Flex>
							) : (
								<Text size="2" color="gray">
									No agents assigned
								</Text>
							)}
						</Flex>
					</InfoWindowF>
				)}
			</GoogleMap>
		);
	};

	return (
		<Flex direction="column" gap="3" style={{ height: "100%" }}>
			<Flex direction="column" gap="1">
				<Heading size="4">Maps</Heading>
				<Text size="2" color="gray">
					Showing {visibleZones.length || zonesWithCoords.length} of {" "}
					{zonesWithCoords.length} mapped locations
				</Text>
				<Text size="2">{mapDescription}</Text>
			</Flex>

			<Box
				style={{
					flexGrow: 1,
					minHeight: 0,
					borderRadius: "var(--radius-3)",
					overflow: "hidden",
					position: "relative",
				}}
			>
				{loadingData ? (
					<Text color="gray" size="2">
						Fetching locations...
					</Text>
				) : fetchError ? (
					<Text color="red" size="2">
						{fetchError}
					</Text>
				) : (
					<Box style={{ width: "100%", height: "100%" }}>
						{renderMap()}
					</Box>
				)}
			</Box>
		</Flex>
	);
}
