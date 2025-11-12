"use client";

import { Button } from "@/components/ui/button";
import { LogIn, PanelsTopLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
	const router = useRouter();

	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
			<h1 className="text-2xl md:text-3xl font-bold mb-6">
				Welcome to Aspinall Reports
			</h1>

			<p className="text-lg md:text-lg text-gray-700 mb-10 max-w-xl">
				This app helps you submit, track, and review reports with
				location data in an easy and structured way.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl w-full">
				<div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
					<h2 className="text-xl font-semibold mb-2">Step 1</h2>
					<p>
						Create a new report by filling out the form with your
						name, description, and location.
					</p>
				</div>
				<div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
					<h2 className="text-xl font-semibold mb-2">Step 2</h2>
					<p>
						View submitted reports in the dashboard table, with easy
						access to all details.
					</p>
				</div>
				<div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
					<h2 className="text-xl font-semibold mb-2">Step 3</h2>
					<p>
						Analyze locations and report data to make informed
						decisions quickly.
					</p>
				</div>
			</div>

			<div className="flex flex-col md:flex-row gap-4">
				<Button onClick={() => router.push("/login")}>
					<LogIn />
					Login
				</Button>
				<Button
					variant="outline"
					onClick={() => router.push("/dashboard")}
				>
					<PanelsTopLeft />
					Dashboard
				</Button>
			</div>
		</main>
	);
}
