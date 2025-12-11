"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Flex, Heading, Text, Badge } from "@radix-ui/themes";
import { usePathname, useRouter } from "next/navigation";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { getAllUsers, getAllZones, getAllLocations } from "@/app/firestore-fetch";
import { UserDocument, ZoneDocument, LocationDocument } from "@/app/firestore";
import { useDashboardSelection } from "@/hooks/dashboard-selection-context";

const DEFAULT_CENTER = { lat: -18.766947, lng: 46.869107 };
const DEFAULT_ZOOM = 5;

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
	const router = useRouter();
	const segments = getSegments(pathname);
	const isZoneView = segments[1] === "zone";
	const [zones, setZones] = useState<ZoneDocument[]>([]);
	const [users, setUsers] = useState<UserDocument[]>([]);
	const [locations, setLocations] = useState<LocationDocument[]>([]);
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
				const [zonesRes, usersRes, locationsRes] = await Promise.all([
					getAllZones(),
					getAllUsers(),
					getAllLocations(),
				]);
				if (!ignore) {
					setZones(zonesRes);
					setUsers(usersRes);
					setLocations(locationsRes);
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

	const selectedZone = selectedZoneId
		? zones.find((z) => z.id === selectedZoneId)
		: undefined;
	const selectedUser = users.find((u) => u.uid === selectedUserId);
	const selectedUserName = selectedUser?.displayName || "this agent";

	const locationsWithCoords = useMemo(
		() => locations.filter((loc) => loc.coordinates),
		[locations]
	);

	const zonePins = useMemo(
		() => zones.filter((z) => z.coordinates),
		[zones]
	);

	const visibleZonePins = useMemo(() => {
		if (!isZoneView) return [];
		if (selectedZoneId) {
			const target = zonePins.find((z) => z.id === selectedZoneId);
			return target ? [target] : [];
		}
		return zonePins;
	}, [zonePins, isZoneView, selectedZoneId]);

	const visibleLocations = useMemo(() => {
		let list = locationsWithCoords;
		if (selectedZone) {
			const allowedUsers = selectedZone.assignedUserIds || [];
			list = allowedUsers.length
				? list.filter((loc) => allowedUsers.includes(loc.userId))
				: [];
		}
		if (selectedUserId) {
			list = list.filter((loc) => loc.userId === selectedUserId);
		}
		if (isZoneView && !selectedZoneId) {
			return [];
		}
		return list;
	}, [
		locationsWithCoords,
		selectedZone,
		selectedUserId,
		isZoneView,
		selectedZoneId,
	]);

	const activeLocation = useMemo(
		() => locations.find((loc) => loc.id === focusedLocationId),
		[locations, focusedLocationId]
	);

	const mapCenter = useMemo(() => {
		if (activeLocation?.coordinates) {
			return activeLocation.coordinates;
		}
		if (selectedZone?.coordinates) {
			return selectedZone.coordinates;
		}
		const targetLocations = visibleLocations.length
			? visibleLocations
			: locationsWithCoords;
		if (targetLocations.length) {
			const total = targetLocations.reduce(
				(acc, loc) => {
					if (!loc.coordinates) return acc;
					return {
						lat: acc.lat + loc.coordinates.lat,
						lng: acc.lng + loc.coordinates.lng,
					};
				},
				{ lat: 0, lng: 0 }
			);
			return {
				lat: total.lat / targetLocations.length,
				lng: total.lng / targetLocations.length,
			};
		}
		if (visibleZonePins.length) {
			const sum = visibleZonePins.reduce(
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
				lat: sum.lat / visibleZonePins.length,
				lng: sum.lng / visibleZonePins.length,
			};
		}
		return DEFAULT_CENTER;
	}, [
		activeLocation,
		selectedZone,
		visibleLocations,
		locationsWithCoords,
		visibleZonePins,
	]);

	const mapZoom = activeLocation
		? 11
		: selectedUserId || selectedZoneId
		? 6
		: DEFAULT_ZOOM;

	const mapDescription = useMemo(() => {
		if (selectedZone && selectedUser) {
			return `Viewing ${selectedUserName} in ${selectedZone.name}`;
		}
		if (selectedUser) {
			return `Viewing ${selectedUserName}'s assigned locations`;
		}
		if (selectedZone) {
			return `Showing agents assigned to ${selectedZone.name}`;
		}
		if (isZoneView) {
			return "Select a zone to view its agents";
		}
		return "Active locations overview";
	}, [selectedZone, selectedUser, selectedUserName, isZoneView]);

	const statsText =
		isZoneView && !selectedZoneId
			? `Showing ${visibleZonePins.length} of ${zonePins.length} zones`
			: `Showing ${
					visibleLocations.length || locationsWithCoords.length
				} of ${locationsWithCoords.length} mapped locations`;

	const handleMarkerClick = (locationId: string) => {
		setFocusedLocationId(locationId);
	};

	const handleMapClick = () => {
		setFocusedLocationId(null);
	};

	const handleZoneMarkerClick = (zoneId: string) => {
		setFocusedLocationId(null);
		router.push(`/dashboard/zone/${zoneId}`);
	};

	useEffect(() => {
		if (!focusedLocationId) {
			return;
		}
		if (visibleLocations.some((loc) => loc.id === focusedLocationId)) {
			return;
		}
		setFocusedLocationId(visibleLocations[0]?.id ?? null);
	}, [focusedLocationId, visibleLocations, setFocusedLocationId]);

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
		const locationPins = visibleLocations;
		const shouldRenderLocations = locationPins.length > 0;
		const shouldRenderZones = visibleZonePins.length > 0;

		if (!shouldRenderLocations && !shouldRenderZones) {
			return (
				<Text color="gray" size="2">
					{selectedZone
						? "No agent locations found for this zone."
						: selectedUser
						? "This user has no mapped locations yet."
						: "No locations available."}
				</Text>
			);
		}

		return (
			<GoogleMap
				mapContainerStyle={{ width: "100%", height: "100%" }}
				zoom={mapZoom}
				center={mapCenter}
				options={mapOptions}
				onClick={handleMapClick}
			>
				{shouldRenderZones &&
					visibleZonePins.map((zone) =>
						zone.coordinates ? (
							<MarkerF
								key={`zone-${zone.id}`}
								position={zone.coordinates}
								label={{
									text: zone.name,
									className:
										"dashboard-map-marker-label" +
										(zone.id === selectedZoneId
											? " dashboard-map-marker-label--active"
											: ""),
								}}
								icon={{
									path: google.maps.SymbolPath.CIRCLE,
									scale: zone.id === selectedZoneId ? 10 : 8,
									fillColor:
										zone.id === selectedZoneId
											? "#7c3aed"
											: "#14b8a6",
									fillOpacity: 0.95,
									strokeWeight: 2,
									strokeColor: "white",
								}}
								onClick={() => handleZoneMarkerClick(zone.id)}
							/>
						) : null
					)}
				{shouldRenderLocations &&
					locationPins.map((loc) =>
						loc.coordinates ? (
							<MarkerF
								key={loc.id}
							position={loc.coordinates}
							label={{
								text: loc.name,
								className:
									"dashboard-map-marker-label" +
								(activeLocation?.id === loc.id
									? " dashboard-map-marker-label--active"
									: ""),
							}}
							icon={{
								path: google.maps.SymbolPath.CIRCLE,
								scale: activeLocation?.id === loc.id ? 10 : 7,
								fillColor: activeLocation?.id === loc.id
									? "#7c3aed"
									: selectedUserId
									? "#1d4ed8"
									: "#111827",
								fillOpacity: 0.9,
								strokeWeight: 2,
								strokeColor: "white",
							}}
							onClick={() => handleMarkerClick(loc.id)}
						/>
					) : null
					)}
				{activeLocation?.coordinates && (
					<InfoWindowF
						position={activeLocation.coordinates}
						onCloseClick={() => setFocusedLocationId(null)}
					>
						<Flex direction="column" gap="1">
							<Text weight="bold">{activeLocation.name}</Text>
							<Text size="2" color="gray">
								{activeLocation.coordinates.lat.toFixed(4)},
								{activeLocation.coordinates.lng.toFixed(4)}
							</Text>
							{activeLocation.description && (
								<Text size="2">{activeLocation.description}</Text>
							)}
							{activeLocation.userId && (
								<Badge color="indigo" size="1">
									{users.find((user) => user.uid === activeLocation.userId)
										?.displayName || "Unassigned"}
								</Badge>
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
					{statsText}
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
