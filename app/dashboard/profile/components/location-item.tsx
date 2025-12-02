"use client";

import { Box, Flex, Text, Button, Dialog, TextField } from "@radix-ui/themes";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Location } from "../types";

interface LocationItemProps {
	location: Location;
	onUpdate: (updatedLoc: Location) => void;
	onDelete: (id: number) => void;
}

export default function LocationItem({
	location,
	onUpdate,
	onDelete,
}: LocationItemProps) {
	// Local state for the Edit Form
	const [editName, setEditName] = useState(location.name);
	const [editCoords, setEditCoords] = useState(location.coords);
	const [editRegion, setEditRegion] = useState(location.region);
	const [openEdit, setOpenEdit] = useState(false);

	const handleSaveEdit = () => {
		onUpdate({
			...location,
			name: editName,
			region: editRegion,
			coords: editCoords,
		});
		setOpenEdit(false);
	};

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
					<Flex align="center" gap="2" mt="1">
						<Text size="2" color="gray">
							{location.coords} • {location.region}
						</Text>
					</Flex>
				</Box>

				<Flex direction="column" gap="2">
					{/* --- EDIT DIALOG --- */}
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
										Region
									</Text>
									<TextField.Root
										value={editRegion}
										onChange={(e) =>
											setEditRegion(e.target.value)
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
										Coordinates
									</Text>
									<TextField.Root
										value={editCoords}
										onChange={(e) =>
											setEditCoords(e.target.value)
										}
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

					{/* --- DELETE DIALOG --- */}
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
