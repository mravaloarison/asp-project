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

export default function NewForm() {
	const [location, setLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [dropPin, setDropPin] = useState(false);
	const AnyMaps = Maps as any;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const name = formData.get("reporterName") as string;
		const description = formData.get("description") as string;

		const report = {
			name,
			description,
			location: location
				? { lat: location.lat, lng: location.lng }
				: "No location selected",
			submittedAt: new Date().toLocaleString(),
		};

		console.log("📝 Report submitted:", report);
	};

	return (
		<div className="w-full mx-auto max-w-md mt-20">
			<form onSubmit={handleSubmit}>
				<FieldGroup>
					<FieldSet>
						<FieldLegend>Aspinall report</FieldLegend>
						<FieldDescription>
							Make sure to fill out all the required fields
						</FieldDescription>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="reporterName">
									Reporter's name
								</FieldLabel>
								<Input
									id="reporterName"
									name="reporterName"
									placeholder="Rakotonarivo"
									required
								/>
							</Field>
						</FieldGroup>

						<FieldGroup>
							<Field>
								<FieldLabel>Location</FieldLabel>
								<p className="text-sm text-muted-foreground">
									Latitude: {location?.lat ?? "N/A"},
									Longitude: {location?.lng ?? "N/A"}
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
										<div>
											<p className="text-sm text-muted-foreground mt-2">
												{dropPin
													? "Drag the map to move the pin to your desired location."
													: "Click 'Drop/Move Pin' to start selecting a location."}
											</p>
											{location && (
												<p className="text-sm text-muted-foreground mt-1">
													Lat: {location.lat}, Lng:{" "}
													{location.lng}
												</p>
											)}
										</div>
										<DialogFooter>
											<div className="flex justify-between w-full">
												<Button
													type="button"
													variant="outline"
													onClick={() =>
														setDropPin(true)
													}
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
						</FieldGroup>
					</FieldSet>
					<FieldSet>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="description">
									Description
								</FieldLabel>
								<Textarea
									id="description"
									name="description"
									placeholder="Add any additional description"
									className="resize-none"
								/>
							</Field>
						</FieldGroup>
					</FieldSet>
					<Field orientation="horizontal">
						<Button type="submit">Submit</Button>
						<Button variant="outline" type="button">
							Cancel
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	);
}
