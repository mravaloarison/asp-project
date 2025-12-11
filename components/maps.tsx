"use client";

import { useEffect, useMemo, useState, Fragment } from "react";
import { Box, Flex, Heading, Text, Badge } from "@radix-ui/themes";
import { usePathname, useRouter } from "next/navigation";
import {
	GoogleMap,
	InfoWindowF,
	MarkerF,
	CircleF,
	useJsApiLoader,
} from "@react-google-maps/api";
import {
	getAllUsers,
	getAllZones,
	getAllLocations,
} from "@/app/firestore-fetch";
import {
	UserDocument,
	ZoneDocument,
	LocationDocument,
} from "@/app/firestore";
import { useDashboardSelection } from "@/hooks/dashboard-selection-context";

const DEFAULT_CENTER = { lat: -18.766947, lng: 46.869107 };
const DEFAULT_ZOOM = 5;
const ZONE_RADIUS_METERS = 20000;

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

const toZoneId = (value?: string) =>
	value?.toLowerCase().replace(/\s+/g, "-") || undefined;

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

	const userMap = useMemo(() => {
		const map = new Map<string, UserDocument>();
		users.forEach((u) => map.set(u.uid, u));
		return map;
	}, [users]);

	const locationsWithCoords = useMemo(
		() => locations.filter((loc) => loc.coordinates),
		[locations]
	);

	const zoneCentroids = useMemo(() => {
		const accum = new Map<
			string,
			{ lat: number; lng: number; count: number }
		>();
		locationsWithCoords.forEach((loc) => {
			const zoneKey = toZoneId(loc.zone);
			if (!zoneKey || !loc.coordinates) return;
			const existing = accum.get(zoneKey) || {
				lat: 0,
				lng: 0,
				count: 0,
			};
			existing.lat += loc.coordinates.lat;
			existing.lng += loc.coordinates.lng;
			existing.count += 1;
			accum.set(zoneKey, existing);
		});
		const result = new Map<string, { lat: number; lng: number }>();
		accum.forEach((value, key) => {
			result.set(key, {
				lat: value.lat / value.count,
				lng: value.lng / value.count,
			});
		});
		return result;
	}, [locationsWithCoords]);

	const visibleLocations = useMemo(() => {
		let list = locationsWithCoords;
		if (selectedZoneId) {
			list = list.filter(
				(loc) => toZoneId(loc.zone) === selectedZoneId
			);
		}
		if (selectedUserId) {
			list = list.filter((loc) => loc.userId === selectedUserId);
		}
		if (isZoneView && !selectedZoneId) {
			return [];
		}
		return list;
	}, [locationsWithCoords, selectedZoneId, selectedUserId, isZoneView]);

	const activeLocation = useMemo(
		() => locationsWithCoords.find((loc) => loc.id === focusedLocationId),
		[locationsWithCoords, focusedLocationId]
	);

	interface ZoneMarkerData {
		zone: ZoneDocument;
		coordinates: { lat: number; lng: number };
	}

	const zoneMarkers = useMemo<ZoneMarkerData[]>(() => {
		if (!isZoneView) return [];
		const markers: ZoneMarkerData[] = [];
		zones.forEach((zone) => {
			const coords =
				zone.coordinates ||
				zoneCentroids.get(zone.id) ||
				(zone.name ? zoneCentroids.get(toZoneId(zone.name)) : undefined);
			if (!coords) return;
			markers.push({ zone, coordinates: coords });
		});
		if (selectedZoneId) {
			return markers.filter((marker) => marker.zone.id === selectedZoneId);
		}
		return markers;
	}, [isZoneView, zones, zoneCentroids, selectedZoneId]);

	const selectedZoneCenter = useMemo(() => {
		if (!selectedZoneId) return undefined;
		return (
			selectedZone?.coordinates ||
			zoneCentroids.get(selectedZoneId) ||
			(selectedZone?.name
				? zoneCentroids.get(toZoneId(selectedZone.name))
				: undefined)
		);
	}, [selectedZoneId, selectedZone, zoneCentroids]);

	const mapCenter = useMemo(() => {
		if (activeLocation?.coordinates) {
			return activeLocation.coordinates;
		}
		if (selectedZoneCenter) {
			return selectedZoneCenter;
		}
		const target = visibleLocations.length
			? visibleLocations
			: locationsWithCoords;
		if (target.length) {
			const total = target.reduce(
				(acc, loc) => ({
					lat: acc.lat + (loc.coordinates?.lat || 0),
					lng: acc.lng + (loc.coordinates?.lng || 0),
				}),
				{ lat: 0, lng: 0 }
			);
			return {
				lat: total.lat / target.length,
				lng: total.lng / target.length,
			};
		}
		if (zoneMarkers.length) {
			const sum = zoneMarkers.reduce(
				(acc, marker) => ({
					lat: acc.lat + marker.coordinates.lat,
					lng: acc.lng + marker.coordinates.lng,
				}),
				{ lat: 0, lng: 0 }
			);
			return {
				lat: sum.lat / zoneMarkers.length,
				lng: sum.lng / zoneMarkers.length,
			};
		}
		return DEFAULT_CENTER;
	}, [
		activeLocation,
		selectedZoneCenter,
		visibleLocations,
		locationsWithCoords,
		zoneMarkers,
	]);

	const mapZoom = activeLocation
		? 13
		: selectedZoneId
		? 8
		: DEFAULT_ZOOM;

	const mapDescription = useMemo(() => {
		if (selectedZone && selectedUser) {
			return `Viewing ${selectedUser.displayName}'s locations inside ${selectedZone.name}`;
		}
		if (selectedZone) {
			return `Showing all agent locations for ${selectedZone.name}`;
		}
		if (selectedUser) {
			return `Viewing ${selectedUser.displayName}'s assigned locations`;
		}
		if (isZoneView) {
			return "Select a zone pin to drill into its agents";
		}
		return "Overview of all active agents";
	}, [selectedZone, selectedUser, isZoneView]);

	const mapTitle = isZoneView ? "Maps by Zones" : "Maps by Users";

	const handleLocationMarkerClick = (location: LocationDocument) => {
		setFocusedLocationId(location.id);
		if (selectedZoneId) {
			router.push(`/dashboard/zone/${selectedZoneId}/user/${location.userId}`);
		} else {
			router.push(`/dashboard/user/${location.userId}`);
		}
	};

	const handleMapClick = () => {
		setFocusedLocationId(null);
	};

	const handleZoneMarkerClick = (zoneId: string) => {
		setFocusedLocationId(null);
		router.push(`/dashboard/zone/${zoneId}`);
	};

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

		const hasLocationPins = visibleLocations.length > 0;
		const hasZonePins = zoneMarkers.length > 0;

		if (!hasLocationPins && !hasZonePins) {
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
				{hasZonePins &&
					zoneMarkers.map(({ zone, coordinates }) => (
						<Fragment key={`zone-wrap-${zone.id}`}>
							<MarkerF
								key={`zone-${zone.id}`}
								position={coordinates}
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
							<CircleF
								key={`zone-circle-${zone.id}`}
								center={coordinates}
								radius={ZONE_RADIUS_METERS}
								options={{
									fillColor:
										zone.id === selectedZoneId
											? "rgba(124, 58, 237, 0.15)"
											: "rgba(20, 184, 166, 0.12)",
									strokeColor:
										zone.id === selectedZoneId
											? "#7c3aed"
											: "#14b8a6",
									strokeWeight: 1.5,
								}}
							/>
						</Fragment>
					))}
				{hasLocationPins &&
					visibleLocations.map((loc) =>
						loc.coordinates ? (
							<MarkerF
								key={loc.id}
								position={loc.coordinates}
								label={{
									text:
										userMap.get(loc.userId)?.displayName ||
										"Unknown agent",
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
										: selectedUserId && loc.userId === selectedUserId
										? "#1d4ed8"
										: "#111827",
									fillOpacity: 0.9,
									strokeWeight: 2,
									strokeColor: "white",
								}}
								onClick={() => handleLocationMarkerClick(loc)}
							/>
						) : null
					)}
				{activeLocation?.coordinates && (
					<InfoWindowF
						position={activeLocation.coordinates}
						onCloseClick={() => setFocusedLocationId(null)}
					>
						<Flex direction="column" gap="1">
							<Text weight="bold">
								{userMap.get(activeLocation.userId)?.displayName ||
									"Unknown agent"}
							</Text>
							<Text size="2">{activeLocation.name}</Text>
							<Text size="2" color="gray">
								{activeLocation.coordinates.lat.toFixed(4)},
								{activeLocation.coordinates.lng.toFixed(4)}
							</Text>
							{activeLocation.description && (
								<Text size="2">{activeLocation.description}</Text>
							)}
							<Text size="2" color="gray">
								Zone: {activeLocation.zone || "Uncategorized"}
							</Text>
						</Flex>
					</InfoWindowF>
				)}
			</GoogleMap>
		);
	};

	return (
		<Flex direction="column" gap="3" style={{ height: "100%" }}>
			<Flex direction="column" gap="1">
				<Heading size="4">{mapTitle}</Heading>
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
