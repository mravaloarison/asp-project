import {
	APIProvider,
	Map,
	MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const Maps = () => {
	function handleCameraChange(ev: MapCameraChangedEvent) {
		console.log(
			"camera changed:",
			ev.detail.center,
			"zoom:",
			ev.detail.zoom
		);
	}

	const cleanMapStyles = [
		{ featureType: "poi", stylers: [{ visibility: "off" }] },
		{ featureType: "transit", stylers: [{ visibility: "off" }] },
		{
			featureType: "road",
			elementType: "labels.icon",
			stylers: [{ visibility: "off" }],
		},
		{
			featureType: "administrative",
			elementType: "labels",
			stylers: [{ visibility: "off" }],
		},
		{ featureType: "poi.business", stylers: [{ visibility: "off" }] },
		{ featureType: "poi.park", stylers: [{ visibility: "off" }] },
		{ featureType: "poi.medical", stylers: [{ visibility: "off" }] },
		{ featureType: "poi.school", stylers: [{ visibility: "off" }] },
		{ featureType: "poi.sports_complex", stylers: [{ visibility: "off" }] },
	];

	return (
		<APIProvider
			apiKey={API_KEY}
			onLoad={() => console.log("Maps API has loaded.")}
		>
			<Map
				defaultZoom={6}
				defaultCenter={{ lat: -18.8792, lng: 47.5079 }}
				disableDefaultUI
				styles={cleanMapStyles}
				onCameraChanged={handleCameraChange}
			></Map>
		</APIProvider>
	);
};

export default Maps;
