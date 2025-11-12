"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
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
import { ArrowLeft, MapPin } from "lucide-react";
import ReportMap from "./report-map";

type Report = {
	id: string;
	name: string;
	description: string;
	location: string;
	submittedAt?: string;
};

export default function ViewReport() {
	const { id } = useParams();
	const [report, setReport] = useState<Report | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;

		const fetchReport = async () => {
			try {
				const docRef = doc(db, "reports", id as string);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const data = docSnap.data();
					setReport({
						id: docSnap.id,
						name: data.name || "—",
						description: data.description || "—",
						location: data.location || "—",
						submittedAt: data.submittedAt?.toDate
							? data.submittedAt.toDate().toISOString()
							: null,
					});
				}
			} catch (error) {
				console.error("Error fetching report:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchReport();
	}, [id]);

	if (loading) return <p className="mt-20 text-center">Loading report...</p>;
	if (!report) return <p className="mt-20 text-center">Report not found.</p>;

	return (
		<div className="w-full mx-auto max-w-2xl h-auto my-20">
			<FieldGroup>
				<FieldSet>
					<FieldLegend>Report Details</FieldLegend>
					<FieldDescription>
						Below are the submitted details for this report.
					</FieldDescription>

					<Field>
						<FieldLabel>Reporter's Name</FieldLabel>
						<Input value={report.name} disabled readOnly />
					</Field>

					<Field>
						<FieldLabel>Location</FieldLabel>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<MapPin className="w-4 h-4" />
							<span>{report.location}</span>
						</div>
						<ReportMap location={report.location} />
					</Field>

					<Field>
						<FieldLabel>Description</FieldLabel>
						<Textarea
							value={report.description}
							disabled
							readOnly
							className="resize-none"
						/>
					</Field>

					<Field>
						<FieldLabel>Submitted At</FieldLabel>
						<Input
							value={
								report.submittedAt
									? new Date(
											report.submittedAt
									  ).toLocaleString()
									: "—"
							}
							disabled
							readOnly
						/>
					</Field>
				</FieldSet>

				<Field orientation="horizontal">
					<Button
						variant="outline"
						onClick={() => window.history.back()}
					>
						<ArrowLeft />
						Back
					</Button>
				</Field>
			</FieldGroup>
		</div>
	);
}
