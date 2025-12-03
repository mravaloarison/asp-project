"use client";

import { Flex, Heading, IconButton } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

interface DashboardViewHeaderProps {
	viewState: string;
	selectedZoneName: string | undefined;
	goBack: () => void;
}

export default function DashboardViewHeader({
	viewState,
	selectedZoneName,
	goBack,
}: DashboardViewHeaderProps) {
	if (viewState === "ZONE_MEMBERS") {
		return (
			<Flex
				align="center"
				gap="3"
				pb="3"
				pt="1"
				style={{ height: "40px" }}
			>
				<IconButton variant="ghost" onClick={goBack}>
					<ArrowLeftIcon width="20" height="20" />
				</IconButton>
				<Heading size="4">{selectedZoneName}</Heading>
			</Flex>
		);
	}

	if (viewState === "USER_READ_ONLY" || viewState === "ZONE_USER_READ_ONLY") {
		return (
			<Flex
				align="center"
				gap="3"
				pb="2"
				pt="1"
				style={{ height: "40px" }}
			>
				<IconButton variant="ghost" onClick={goBack}>
					<ArrowLeftIcon width="20" height="20" />
				</IconButton>
				<Heading size="4">User Details</Heading>
			</Flex>
		);
	}

	return null;
}
