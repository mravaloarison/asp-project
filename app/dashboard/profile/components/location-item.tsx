"use client";

import {
	Box,
	Flex,
	Text,
	Button,
	Dialog,
	TextField,
	TextArea,
} from "@radix-ui/themes";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { LocationDocument } from "@/app/firestore";

interface LocationItemProps {
	location: LocationDocument;
	onUpdate: (updatedLoc: LocationDocument) => void;
	onDelete: (id: string) => void;
}

export default function LocationItem({
	location,
	onUpdate,
	onDelete,
}: LocationItemProps) {
	const [editName, setEditName] = useState(location.name);
	const [editDescription, setEditDescription] = useState(
		location.description || ""
	);
	const [openEdit, setOpenEdit] = useState(false);

	const handleSaveEdit = () => {
		onUpdate({
			...location,
			name: editName,
			description: editDescription,
		});
		setOpenEdit(false);
	};

	const coordsString = `${location.coordinates.lat.toFixed(
		4
	)}, ${location.coordinates.lng.toFixed(4)}`;

	return (
		<Box
			p="3"
			style={{
				border: "1px solid var(--gray-6)",
				backgroundColor: "var(--gray-2)",
				borderRadius: "var(--radius-3)",
				flexShrink: 0,
			}}
		>
			<Flex justify="between" align="start">
				<Box>
					<Text size="3" weight="medium">
						{location.name}
					</Text>
					<Flex direction="column" gap="1" mt="1">
						<Text size="2" color="gray">
							{coordsString}
						</Text>
						{location.description && (
							<Text size="2" style={{ fontStyle: "italic" }}>
								{location.description}
							</Text>
						)}
					</Flex>
				</Box>

				<Flex direction="column" gap="2">
					<Dialog.Root open={openEdit} onOpenChange={setOpenEdit}>
						<Dialog.Trigger>
							<Button
								variant="ghost"
								size="2"
								title="Edit Location"
							>
								<Pencil2Icon />
							</Button>
						</Dialog.Trigger>

						<Dialog.Content maxWidth="450px">
							<Dialog.Title>Edit Location</Dialog.Title>
							<Dialog.Description size="2" mb="4">
								Update details for this operating location.
							</Dialog.Description>

							<Flex direction="column" gap="3">
								<label>
									<Text
										as="div"
										size="2"
										mb="1"
										weight="bold"
									>
										Name
									</Text>
									<TextField.Root
										value={editName}
										onChange={(e) =>
											setEditName(e.target.value)
										}
									/>
								</label>
								<label>
									<Text
										as="div"
										size="2"
										mb="1"
										weight="bold"
									>
										Description
									</Text>
									<TextArea
										value={editDescription}
										onChange={(e) =>
											setEditDescription(e.target.value)
										}
										style={{ height: 80 }}
									/>
								</label>
							</Flex>

							<Flex gap="3" mt="4" justify="end">
								<Dialog.Close>
									<Button variant="soft" color="gray">
										Cancel
									</Button>
								</Dialog.Close>
								<Button onClick={handleSaveEdit}>
									Save Changes
								</Button>
							</Flex>
						</Dialog.Content>
					</Dialog.Root>

					<Dialog.Root>
						<Dialog.Trigger>
							<Button
								variant="ghost"
								color="red"
								size="2"
								title="Delete Location"
							>
								<TrashIcon />
							</Button>
						</Dialog.Trigger>

						<Dialog.Content maxWidth="450px">
							<Dialog.Title>Confirm Deletion</Dialog.Title>
							<Dialog.Description size="2" mb="4">
								Are you sure you want to remove{" "}
								<strong>{location.name}</strong>? This action
								cannot be undone.
							</Dialog.Description>

							<Flex gap="3" mt="4" justify="end">
								<Dialog.Close>
									<Button variant="soft" color="gray">
										Cancel
									</Button>
								</Dialog.Close>
								<Dialog.Close>
									<Button
										color="red"
										onClick={() => onDelete(location.id)}
									>
										Delete
									</Button>
								</Dialog.Close>
							</Flex>
						</Dialog.Content>
					</Dialog.Root>
				</Flex>
			</Flex>
		</Box>
	);
}
