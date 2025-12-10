import { Flex, Text, Card } from "@radix-ui/themes";
import { PersonIcon } from "@radix-ui/react-icons";

interface ZoneCardProps {
	ZoneName: string;
	numberOfUsers: number;
}

export default function ZoneCard({ ZoneName, numberOfUsers }: ZoneCardProps) {
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

				<Flex gap="2" align="center">
					<PersonIcon />
					<Text size="2" color="gray" weight="medium">
						{numberOfUsers} users
					</Text>
				</Flex>
			</Flex>
		</Card>
	);
}
