"use client";

import { signOut, User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
	const [user, setUser] = useState<User | null>(auth.currentUser);
	const router = useRouter();

	const logout = async () => {
		try {
			await signOut(auth);
			router.push("/signin");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			if (!currentUser) {
				router.push("/signin");
			}
		});
		return () => unsubscribe();
	}, []);

	const userName = user?.displayName || user?.email?.split("@")[0] || "There";

	return (
		<div className="p-8">
			<div className="text-2xl font-bold mb-4">Hello, {userName}!</div>
			{user ? (
				<Button variant="classic" onClick={logout}>
					Logout
				</Button>
			) : (
				<p>You are signed out.</p>
			)}
		</div>
	);
}
