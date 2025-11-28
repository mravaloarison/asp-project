"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../app/firebase";

export default function RootPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				router.replace("/dashboard");
			} else {
				router.replace("/signin");
			}
			setIsLoading(false);
		});

		return () => unsubscribe();
	}, [router]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen text-slate-500 dark:text-slate-400">
				Checking session status...
			</div>
		);
	}

	return null;
}
