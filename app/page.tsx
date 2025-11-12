"use client";

import { Button } from "@/components/ui/button";
import { LogIn, PanelsTopLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
	const router = useRouter();

	return (
		<main className="flex flex-col w-full max-w-2xl mx-auto items-center justify-center min-h-screen text-center">
			<h1 className="text-xl md:text-2xl font-bold mb-6">
				Welcome to Aspinall Reports
			</h1>

			<p className="text-lg md:text-lg text-gray-700 mb-10 max-w-xl">
				This app helps you submit, track, and review your reports with
				location data.
			</p>

			<div className="flex flex-col gap-4 w-full max-w-xs">
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
