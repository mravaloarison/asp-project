"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/app/firebase";

const auth = getAuth(app);

export default function AuthRedirect({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user && pathname !== "/login") {
				router.replace("/login");
			} else if (user && pathname === "/login") {
				router.replace("/dashboard/new-form");
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [router, pathname]);

	if (loading) return null;

	return <>{children}</>;
}
