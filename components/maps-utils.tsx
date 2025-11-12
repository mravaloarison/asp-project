export const cleanMapStyles = [
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

export const BluePin = () => {
	return (
		<div className="relative flex flex-col items-center justify-center">
			<div className="relative flex items-center justify-center">
				<div className="absolute w-6 h-6 bg-blue-400 opacity-40 rounded-full animate-ping" />
				<div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md" />
			</div>

			<span className="mt-2 text-sm font-medium text-blue-700 bg-white/80 px-2 py-0.5 rounded-md shadow-sm backdrop-blur-sm">
				This is you
			</span>
		</div>
	);
};
