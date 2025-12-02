import { Flex, Text, Card } from "@radix-ui/themes";
import { PersonIcon, SewingPinIcon } from "@radix-ui/react-icons";

interface ZoneCardProps {
	ZoneName: string;
	numberOfUsers: number;
	numberOfLocations: number;
}

export default function ZoneCard({
	ZoneName,
	numberOfUsers,
	numberOfLocations,
}: ZoneCardProps) {
	return (
		<Card
			className="user-card-hover-effect"
			style={{
				flexShrink: 0,
				width: "100%",
				transition: "border-color 0.01s ease",
			}}
		>
			<Flex direction="column" style={{ minWidth: 0 }}>
				<Text size="3" weight="medium">
					{ZoneName}
				</Text>

				<Flex gap="2" align="center" pt="3">
					<PersonIcon />
					<Text size="2" color="gray" weight="medium">
						{numberOfUsers} users
					</Text>
				</Flex>

				<Flex gap="2" align="center">
					<SewingPinIcon />
					<Text size="2" color="gray" weight="medium">
						{numberOfLocations} locations
					</Text>
				</Flex>
			</Flex>
		</Card>
	);
}
