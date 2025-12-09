"use client";

import { Box, Text } from "@radix-ui/themes";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

interface StepPinProps {
	lat: number;
	lng: number;
	onDragEnd: (lat: number, lng: number) => void;
}

const containerStyle = {
	width: "100%",
	height: "300px",
	borderRadius: "8px",
};

export default function StepPin({ lat, lng, onDragEnd }: StepPinProps) {
	return (
		<Box style={{ position: "relative" }}>
			<Text size="2" mb="2" as="div" color="gray">
				Drag the red pin to fine-tune the exact location.
			</Text>
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={{ lat, lng }}
				zoom={15}
				options={{
					streetViewControl: false,
					mapTypeControl: false,
				}}
			>
				<MarkerF
					position={{ lat, lng }}
					draggable={true}
					onDragEnd={(e) => {
						if (e.latLng) {
							onDragEnd(e.latLng.lat(), e.latLng.lng());
						}
					}}
				/>
			</GoogleMap>
		</Box>
	);
}
