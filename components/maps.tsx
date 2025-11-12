"use client";

import {
	APIProvider,
	Map,
	MapCameraChangedEvent,
	Marker,
	AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { BluePin } from "./maps-utils";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "";

interface MapsProps {
	defaultLocation: { lat: number; lng: number } | null;
	callingBack: (coords: { lat: number; lng: number }) => void;
	dropPin: boolean;
}

const Maps = ({ defaultLocation, callingBack, dropPin }: MapsProps) => {
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [dropLocation, setDropLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const coords = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};

					setUserLocation(coords);
					setDropLocation(coords);
				},
				(error) => {
					console.error("Error obtaining location:", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}, []);

	function handleCameraChange(ev: MapCameraChangedEvent) {
		const newCenter = ev.detail.center;
		if (dropPin) {
			setDropLocation(newCenter);
			callingBack(newCenter);
		}
	}

	return (
		<APIProvider
			apiKey={API_KEY}
			onLoad={() => console.log("Maps API has loaded.")}
		>
			{userLocation ? (
				<Map
					mapId={MAP_ID}
					defaultCenter={userLocation}
					defaultZoom={15}
					disableDefaultUI
					onCameraChanged={handleCameraChange}
				>
					{defaultLocation ? (
						<Marker position={defaultLocation} />
					) : (
						dropPin &&
						dropLocation && <Marker position={dropLocation} />
					)}

					{userLocation && (
						<AdvancedMarker position={userLocation}>
							{BluePin()}
						</AdvancedMarker>
					)}
				</Map>
			) : (
				<p>Loading map...</p>
			)}
		</APIProvider>
	);
};

export default Maps;
