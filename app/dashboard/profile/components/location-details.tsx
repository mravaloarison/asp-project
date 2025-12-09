"use client";

import { Flex, Text, TextField, TextArea, Select } from "@radix-ui/themes";
import { ZoneDocument } from "@/app/firestore";

interface StepDetailsProps {
	name: string;
	setName: (v: string) => void;
	description: string;
	setDescription: (v: string) => void;
	zoneId: string;
	setZoneId: (v: string) => void;
	zones: ZoneDocument[];
}

export default function StepDetails({
	name,
	setName,
	description,
	setDescription,
	zoneId,
	setZoneId,
	zones,
}: StepDetailsProps) {
	return (
		<Flex direction="column" gap="3">
			<label>
				<Text as="div" size="2" mb="1" weight="bold">
					Location Name
				</Text>
				<TextField.Root
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g. Antananarivo Branch"
				/>
			</label>

			<label>
				<Text as="div" size="2" mb="1" weight="bold">
					Assigned Zone
				</Text>
				<Select.Root value={zoneId} onValueChange={setZoneId}>
					<Select.Trigger
						style={{ width: "100%" }}
						placeholder="Select a zone"
					/>
					<Select.Content>
						<Select.Group>
							<Select.Label>Available Zones</Select.Label>
							{zones.map((z) => (
								<Select.Item key={z.id} value={z.id}>
									{z.name}
								</Select.Item>
							))}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</label>

			<label>
				<Text as="div" size="2" mb="1" weight="bold">
					Description (Optional)
				</Text>
				<TextArea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Add operational notes..."
					style={{ height: 80 }}
				/>
			</label>
		</Flex>
	);
}
