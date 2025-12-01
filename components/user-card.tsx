import { Flex, Text, Avatar, Card } from "@radix-ui/themes";
import {
	BackpackIcon,
	Pencil2Icon,
	SewingPinIcon,
} from "@radix-ui/react-icons";

interface UserCardProps {
	name: string;
	company: string;
	department: string;
	locations: number;
	avatarFallback: string;
}

export default function UserCard({
	name,
	company,
	department,
	locations,
	avatarFallback,
}: UserCardProps) {
	return (
		<Card
			style={{
				flexShrink: 0,
				width: "100%",
			}}
		>
			<Flex gap="3" align="start">
				<Avatar
					size="4"
					fallback={avatarFallback}
					color="blue"
					radius="full"
				/>

				<Flex direction="column" style={{ minWidth: 0 }}>
					<Text size="3" weight="medium">
						{name}
					</Text>

					<Flex gap="2" align="center">
						<BackpackIcon />
						<Text size="2" color="gray" weight="medium">
							{company}
						</Text>
					</Flex>

					<Flex gap="2" align="center">
						<Pencil2Icon />
						<Text size="2" color="gray" weight="medium">
							{department}
						</Text>
					</Flex>

					<Flex gap="2" align="center" style={{ paddingTop: 8 }}>
						<SewingPinIcon />
						<Text size="1" color="gray" weight="medium">
							{locations} locations
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Card>
	);
}
