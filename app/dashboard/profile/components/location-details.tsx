"use client";

import { Flex, Text, TextField, TextArea } from "@radix-ui/themes";

interface StepDetailsProps {
	name: string;
	setName: (v: string) => void;
	description: string;
	setDescription: (v: string) => void;
}

export default function StepDetails({
	name,
	setName,
	description,
	setDescription,
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
					Description (Optional)
				</Text>
				<TextArea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Add operational notes, e.g. Primary Workspace..."
					style={{ height: 80 }}
				/>
			</label>
		</Flex>
	);
}
