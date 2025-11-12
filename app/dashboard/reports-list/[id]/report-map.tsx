"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

type ReportMapProps = {
	location: string;
};

export default function ReportMap({ location }: ReportMapProps) {
	if (!location) return null;

	const [lat, lng] = location.split(",").map(Number);
	const isValidCoords =
		!isNaN(lat) &&
		!isNaN(lng) &&
		Math.abs(lat) <= 90 &&
		Math.abs(lng) <= 180;

	const center = isValidCoords
		? { lat, lng }
		: { lat: 40.7128, lng: -74.006 };

	return (
		<div className="w-full h-64 rounded-2xl overflow-hidden border">
			<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
				<Map
					defaultCenter={center}
					defaultZoom={14}
					disableDefaultUI={true}
					mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID!}
					style={{ width: "100%", height: "100%" }}
				>
					<Marker position={center} />
				</Map>
			</APIProvider>
		</div>
	);
}
