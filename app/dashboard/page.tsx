"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "@/app/firebase";

export default function Dashboard() {
	const auth = getAuth(app);
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) router.replace("/login");
			else setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth, router]);

	if (loading) return <p>Loading...</p>;

	return (
		<div className="w-full max-w-3xl mx-auto p-20 flex justify-center">
			Welcome, {user?.email}!
		</div>
	);
}
