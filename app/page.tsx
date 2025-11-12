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
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Map } from "lucide-react";
import { useState } from "react";
import Maps from "@/components/maps";

export default function Home() {
	const [location, setLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	return (
		<div className="w-full mx-auto max-w-md mt-20">
			<form>
				<FieldGroup>
					<FieldSet>
						<FieldLegend>Aspinall report</FieldLegend>
						<FieldDescription>
							Make sure to fill out all the required fields
						</FieldDescription>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="checkout-7j9-card-name-43j">
									Reporter's name
								</FieldLabel>
								<Input
									id="checkout-7j9-card-name-43j"
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

											{/* Map will go here */}
											<div className="w-full border h-[400px] mt-4">
												<Maps />
											</div>
										</DialogHeader>
									</DialogContent>
								</Dialog>
							</Field>
						</FieldGroup>
					</FieldSet>
					<FieldSet>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="checkout-7j9-optional-comments">
									Description
								</FieldLabel>
								<Textarea
									id="checkout-7j9-optional-comments"
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
