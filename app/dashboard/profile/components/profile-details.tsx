"use client";

import { Flex, Heading, TextField, Button } from "@radix-ui/themes";
import { PersonIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { useState } from "react";

interface ProfileDetailsProps {
	initialName: string;
	initialCompany: string;
	onSave: (name: string, company: string) => Promise<void> | void;
}

export default function ProfileDetails({
	initialName,
	initialCompany,
	onSave,
}: ProfileDetailsProps) {
	const [name, setName] = useState(initialName);
	const [company, setCompany] = useState(initialCompany);
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		setLoading(true);
		await onSave(name, company);
		setLoading(false);
	};

	return (
		<Flex direction="column" gap="3" style={{ flexShrink: 0 }}>
			<Heading size="4">Personal Information</Heading>
			<TextField.Root
				size="3"
				placeholder="Full Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			>
				<TextField.Slot>
					<PersonIcon height="16" width="16" />
				</TextField.Slot>
			</TextField.Root>

			<TextField.Root
				size="3"
				placeholder="Company Name"
				value={company}
				onChange={(e) => setCompany(e.target.value)}
			>
				<TextField.Slot>
					<Pencil2Icon height="16" width="16" />
				</TextField.Slot>
			</TextField.Root>

			<Button size="3" onClick={handleSave} disabled={loading}>
				{loading ? "Saving..." : "Save Profile Changes"}
			</Button>
		</Flex>
	);
}
