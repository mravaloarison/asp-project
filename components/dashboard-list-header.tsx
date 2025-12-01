import { Flex, SegmentedControl, TextField, Text } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface DashboardListSectionHeaderProps {
	currentSegment: string;
	setCurrentSegment: (value: string) => void;
	search: string;
	setSearch: (value: string) => void;
	totalFound: number;
}

export default function DashboardListSectionHeader({
	currentSegment,
	setCurrentSegment,
	search,
	setSearch,
	totalFound,
}: DashboardListSectionHeaderProps) {
	return (
		<Flex gap="3" direction="column" pb="3">
			<Flex justify="center">
				<SegmentedControl.Root
					size="2"
					value={currentSegment}
					onValueChange={setCurrentSegment}
				>
					<SegmentedControl.Item value="users">
						view users
					</SegmentedControl.Item>
					<SegmentedControl.Item value="organizations">
						view organizations
					</SegmentedControl.Item>
				</SegmentedControl.Root>
			</Flex>

			<TextField.Root
				size="3"
				placeholder="Start typing..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				style={{ flexShrink: 0 }}
			>
				<TextField.Slot>
					<MagnifyingGlassIcon height="20" width="20" />
				</TextField.Slot>
			</TextField.Root>

			<Text size="3" weight="medium">
				Found ({totalFound})
			</Text>
		</Flex>
	);
}
