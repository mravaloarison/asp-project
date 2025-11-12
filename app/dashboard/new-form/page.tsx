"use client";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Map, MapPin } from "lucide-react";
import { useState } from "react";
import Maps from "@/components/maps";
import { DialogClose } from "@radix-ui/react-dialog";
import { db } from "@/app/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export default function NewForm() {
	const [location, setLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [dropPin, setDropPin] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [userName, setUserName] = useState("");
	const [description, setDescription] = useState("");
	const AnyMaps = Maps as any;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const name = userName.trim();
		const desc = description.trim();

		if (!name) {
			toast.error("Please enter your name.");
			setIsSubmitting(false);
			return;
		}

		if (!desc) {
			toast.error("Please enter a description.");
			setIsSubmitting(false);
			return;
		}

		const report = {
			name,
			description,
			location: location
				? `${location.lat},${location.lng}`
				: "No location",
			submittedAt: serverTimestamp(),
		};

		try {
			await addDoc(collection(db, "reports"), report);
			toast.success("Report submitted successfully!");
		} catch (error) {
			console.error("Error submitting report:", error);
			toast.error("Failed to submit report.");
		} finally {
			setLocation(null);
			setUserName("");
			setDescription("");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full mx-auto max-w-md mt-20">
			<form onSubmit={handleSubmit}>
				<FieldGroup>
					<FieldSet>
						<FieldLegend>Aspinall Report</FieldLegend>
						<FieldDescription>
							Make sure to fill out all the required fields.
						</FieldDescription>

						<Field>
							<FieldLabel htmlFor="reporterName">
								Reporter's name
							</FieldLabel>
							<Input
								name="reporterName"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								type="text"
								placeholder="Rakotonarivo"
								required
							/>
						</Field>

						<Field>
							<FieldLabel>Location</FieldLabel>
							<p className="text-sm text-muted-foreground">
								Latitude: {location?.lat ?? "N/A"}, Longitude:{" "}
								{location?.lng ?? "N/A"}
							</p>

							<Dialog>
								<DialogTrigger asChild>
									<Button type="button" variant="outline">
										<Map />
										Open map to select location
									</Button>
								</DialogTrigger>

								<DialogContent>
									<DialogHeader>
										<DialogTitle>
											Pin a location on the map
										</DialogTitle>
										<div className="w-full border h-[400px] mt-4 rounded-lg">
											<AnyMaps
												defaultLocation={location}
												callingBack={(coords: {
													lat: number;
													lng: number;
												}) => setLocation(coords)}
												dropPin={dropPin}
											/>
										</div>
									</DialogHeader>

									<p className="text-sm text-muted-foreground mt-2">
										{dropPin
											? "Drag the map to move the pin."
											: "Click 'Drop Pin' to start selecting a location."}
									</p>

									{location && (
										<p className="text-sm text-muted-foreground mt-1">
											Lat: {location.lat}, Lng:{" "}
											{location.lng}
										</p>
									)}

									<DialogFooter>
										<div className="flex justify-between w-full">
											<Button
												type="button"
												variant="outline"
												onClick={() => setDropPin(true)}
											>
												<MapPin />
												{location
													? "Move Pin"
													: "Drop Pin"}
											</Button>

											<DialogClose asChild>
												<Button
													type="button"
													disabled={!dropPin}
													onClick={() =>
														setDropPin(false)
													}
												>
													<Check />
													Save
												</Button>
											</DialogClose>
										</div>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</Field>

						<Field>
							<FieldLabel htmlFor="description">
								Description
							</FieldLabel>
							<Textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								name="description"
								placeholder="Add any additional description"
								className="resize-none"
							/>
						</Field>
					</FieldSet>

					<Field orientation="horizontal">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Submitting..." : "Submit"}
						</Button>
						<Button variant="outline" type="button">
							Cancel
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}
