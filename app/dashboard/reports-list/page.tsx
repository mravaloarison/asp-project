"use client";

import {
	ColumnDef,
	useReactTable,
	getCoreRowModel,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export type Report = {
	id: string;
	name: string;
	description: string;
	location: string;
	submittedAt?: string;
};

export const columns: ColumnDef<Report>[] = [
	{
		accessorKey: "name",
		header: "Reporter Name",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "location",
		header: "Location",
	},
	{
		accessorKey: "submittedAt",
		header: "Submitted At",
		cell: ({ row }) => {
			const ts = row.original.submittedAt;
			return ts ? new Date(ts).toLocaleString() : "—";
		},
	},
	{
		id: "view",
		header: "Action",
		cell: ({ row }) => {
			const report = row.original;
			return (
				<Button
					size="sm"
					variant="outline"
					onClick={() => {
						window.location.href = `/dashboard/reports-list/${report.id}`;
					}}
				>
					View
				</Button>
			);
		},
	},
];

export default function ReportsTable() {
	const [data, setData] = useState<Report[]>([]);

	useEffect(() => {
		const q = query(
			collection(db, "reports"),
			orderBy("submittedAt", "desc")
		);
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const reportsData = snapshot.docs.map((doc) => {
				const d = doc.data();
				return {
					id: doc.id,
					name: d.name || "—",
					description: d.description || "",
					location: d.location || "",
					submittedAt: d.submittedAt?.toDate
						? d.submittedAt.toDate().toISOString()
						: null,
				} as Report;
			});
			setData(reportsData);
		});

		return () => unsubscribe();
	}, []);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-hidden rounded-md mt-20 w-full max-w-3xl mx-auto">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										className="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
									>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center"
							>
								No reports found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
