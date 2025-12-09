"use client";

import {
	Container,
	Card,
	Flex,
	Separator,
	Box,
	Text,
	Button,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
	doc,
	getDoc,
	getFirestore,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import { auth } from "../../firebase";
import ProfileDetails from "./components/profile-details";
import LocationList from "./components/location-list";
import { useRouter } from "next/navigation";
import { UserDocument } from "@/app/firestore";

export default function ProfilePage() {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<UserDocument | null>(null);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const db = getFirestore();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				setUser(currentUser);
				try {
					const docRef = doc(db, "users", currentUser.uid);
					const docSnap = await getDoc(docRef);
					if (docSnap.exists()) {
						setUserData(docSnap.data() as UserDocument);
					}
				} catch (error) {
					console.error(error);
				}
			} else {
				router.push("/signin");
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, [db, router]);

	const showStatus = (msg: string) => {
		setStatusMessage(msg);
		setTimeout(() => setStatusMessage(null), 3000);
	};

	const handleProfileSave = async (name: string, company: string) => {
		if (!user) return;
		try {
			await updateDoc(doc(db, "users", user.uid), {
				displayName: name,
				companyName: company,
			});
			setUserData((prev) =>
				prev
					? { ...prev, displayName: name, companyName: company }
					: null
			);
			showStatus("Profile updated successfully!");
		} catch (error) {
			console.error(error);
			showStatus("Failed to update profile.");
		}
	};

	const handleDeleteAccount = async () => {
		if (!user) return;
		const confirm = window.confirm("Are you sure? This cannot be undone.");
		if (confirm) {
			try {
				await deleteDoc(doc(db, "users", user.uid));
				await user.delete();
				router.push("/signup");
			} catch (error) {
				console.error(error);
				showStatus("Error deleting account. You may need to re-login.");
			}
		}
	};

	if (loading) return null;

	return (
		<Container
			p="4"
			size="1"
			style={{
				flexGrow: 1,
				minHeight: 0,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Card
				size="2"
				style={{
					flexGrow: 1,
					minHeight: 0,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Flex
					direction="column"
					gap="3"
					style={{ flexGrow: 1, minHeight: 0 }}
				>
					{statusMessage && (
						<Box>
							<Text weight="medium" color="green">
								{statusMessage}
							</Text>
						</Box>
					)}

					<ProfileDetails
						initialName={userData?.displayName || ""}
						initialCompany={userData?.companyName || ""}
						onSave={handleProfileSave}
					/>

					<Separator size="4" style={{ flexShrink: 0 }} />

					{user && <LocationList userId={user.uid} />}

					<Separator size="4" style={{ flexShrink: 0 }} />

					<Flex direction="column" gap="3" style={{ flexShrink: 0 }}>
						<Button
							size="3"
							onClick={handleDeleteAccount}
							variant="soft"
							color="red"
						>
							Delete Account
						</Button>
					</Flex>
				</Flex>
			</Card>
		</Container>
	);
}
