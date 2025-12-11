"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Flex, Heading, Text, Badge } from "@radix-ui/themes";
import { usePathname, useRouter } from "next/navigation";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { getAllUsers, getAllZones } from "@/app/firestore-fetch";
import { UserDocument, ZoneDocument } from "@/app/firestore";
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

	const selectedZone = selectedZoneId
		? zones.find((z) => z.id === selectedZoneId)
		: undefined;
	const selectedUser = users.find((u) => u.uid === selectedUserId);
	const selectedUserName = selectedUser?.displayName || "this agent";

	const zonePins = useMemo(
		() => zones.filter((z) => z.coordinates),
		[zones]
	);

	const zoneMarkers = useMemo(() => {
		if (!isZoneView) return [];
		if (selectedZoneId) {
			const target = zonePins.find((z) => z.id === selectedZoneId);
			return target ? [target] : [];
		}
		return zonePins;
	}, [zonePins, isZoneView, selectedZoneId]);

	const userPins = useMemo(() => {
		return zonePins.flatMap((zone) => {
			if (!zone.assignedUserIds?.length || !zone.coordinates) return [];
			return zone.assignedUserIds.map((uid) => {
				const user = users.find((u) => u.uid === uid);
				return {
					id: `${zone.id}-${uid}`,
					zoneId: zone.id,
					userId: uid,
					userName: user?.displayName || "Unknown",
					position: zone.coordinates!,
					zoneName: zone.name,
				};
			});
		});
	}, [zonePins, users]);

	const visibleUserPins = useMemo(() => {
		let pins = userPins;
		if (selectedZoneId) {
			pins = pins.filter((pin) => pin.zoneId === selectedZoneId);
		}
		if (selectedUserId) {
			pins = pins.filter((pin) => pin.userId === selectedUserId);
		}
		if (isZoneView && !selectedZoneId) {
			return [];
		}
		return pins;
	}, [userPins, selectedZoneId, selectedUserId, isZoneView]);

	const activeZoneFocus = useMemo(() => {
		if (focusedLocationId) {
			return zones.find((z) => z.id === focusedLocationId);
		}
		return selectedZone;
	}, [zones, focusedLocationId, selectedZone]);

	const mapCenter = useMemo(() => {
		if (activeZoneFocus?.coordinates) {
			return activeZoneFocus.coordinates;
		}
		if (visibleUserPins.length) {
			const total = visibleUserPins.reduce(
				(acc, pin) => ({
					lat: acc.lat + pin.position.lat,
					lng: acc.lng + pin.position.lng,
				}),
				{ lat: 0, lng: 0 }
			);
			return {
				lat: total.lat / visibleUserPins.length,
				lng: total.lng / visibleUserPins.length,
			};
		}
		if (zoneMarkers.length) {
			const sum = zoneMarkers.reduce(
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
				lat: sum.lat / zoneMarkers.length,
				lng: sum.lng / zoneMarkers.length,
			};
		}
		return DEFAULT_CENTER;
	}, [activeZoneFocus, visibleUserPins, zoneMarkers]);

	const mapZoom =
		activeZoneFocus || selectedUserId
			? 11
			: selectedZoneId
			? 7
			: DEFAULT_ZOOM;

	const mapDescription = useMemo(() => {
		if (selectedZone && selectedUser) {
			return `Viewing ${selectedUserName} assigned to ${selectedZone.name}`;
		}
		if (selectedZone) {
			return `Showing agents assigned to ${selectedZone.name}`;
		}
		if (selectedUser) {
			return `Viewing ${selectedUserName}'s active zones`;
		}
		if (isZoneView) {
			return "Select a zone pin to drill into its agents";
		}
		return "Overview of all field agents";
	}, [selectedZone, selectedUser, selectedUserName, isZoneView]);

	const mapTitle = isZoneView ? "Maps by Zones" : "Maps by Users";

	const handleMarkerClick = (zoneId: string) => {
		setFocusedLocationId(zoneId);
	};

	const handleMapClick = () => {
		setFocusedLocationId(null);
	};

	const handleZoneMarkerClick = (zoneId: string) => {
		setFocusedLocationId(zoneId);
		router.push(`/dashboard/zone/${zoneId}`);
	};

	useEffect(() => {
		if (isZoneView && !selectedZoneId) {
			setFocusedLocationId(null);
		}
	}, [isZoneView, selectedZoneId, setFocusedLocationId]);

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
			const shouldRenderLocations = visibleUserPins.length > 0;
			const shouldRenderZones = zoneMarkers.length > 0;

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
						zoneMarkers.map((zone) =>
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
						visibleUserPins.map((pin) => (
							<MarkerF
								key={pin.id}
								position={pin.position}
								label={{
									text: pin.userName,
									className:
										"dashboard-map-marker-label" +
										(activeZoneFocus?.id === pin.zoneId
											? " dashboard-map-marker-label--active"
											: ""),
								}}
								icon={{
									path: google.maps.SymbolPath.CIRCLE,
									scale: activeZoneFocus?.id === pin.zoneId ? 10 : 7,
									fillColor: activeZoneFocus?.id === pin.zoneId
										? "#7c3aed"
										: selectedUserId && pin.userId === selectedUserId
										? "#1d4ed8"
										: "#111827",
									fillOpacity: 0.9,
									strokeWeight: 2,
									strokeColor: "white",
								}}
								onClick={() => handleMarkerClick(pin.zoneId)}
							/>
						))}
					{activeZoneFocus?.coordinates && (
						<InfoWindowF
							position={activeZoneFocus.coordinates}
							onCloseClick={() => setFocusedLocationId(null)}
						>
							<Flex direction="column" gap="1">
								<Text weight="bold">{activeZoneFocus.name}</Text>
								<Text size="2" color="gray">
									{activeZoneFocus.coordinates.lat.toFixed(4)},
									{activeZoneFocus.coordinates.lng.toFixed(4)}
								</Text>
								{activeZoneFocus.description && (
									<Text size="2">{activeZoneFocus.description}</Text>
								)}
								{activeZoneFocus.assignedUserIds?.length ? (
									<Flex gap="1" wrap="wrap">
										{activeZoneFocus.assignedUserIds.map((uid) => {
											const user = users.find((u) => u.uid === uid);
											return (
												<Badge key={uid} color="indigo" size="1">
													{user?.displayName || "Unassigned"}
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
