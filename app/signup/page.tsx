"use client";

import AuthLayout from "../../components/auth-layout";
import SignUpFormContent from "../../components/signup-form";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { UserDocument } from "../firestore";

export default function Page() {
	const router = useRouter();
	const db = getFirestore();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [company, setCompany] = useState("");

	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const description = "Create your account to get started.";

	async function handleSignUpAuth() {
		if (!email || !password || !confirmPassword) {
			setErrorMsg(
				"Please enter email, password, and confirm your password."
			);
			throw new Error("Missing fields");
		}

		if (password !== confirmPassword) {
			setErrorMsg("Passwords do not match.");
			throw new Error("Passwords mismatch");
		}

		setErrorMsg(null);
		setLoading(true);

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			setLoading(false);
		} catch (error: any) {
			setLoading(false);
			setErrorMsg(error.message);
			throw error;
		}
	}

	async function handleCompleteProfile() {
		if (!name || !company) {
			setErrorMsg("Please enter your name and company.");
			return;
		}

		setErrorMsg(null);
		setLoading(true);

		try {
			const user = auth.currentUser;
			if (!user) throw new Error("No authenticated user found");

			await updateProfile(user, { displayName: name });

			const userData: UserDocument = {
				uid: user.uid,
				email: user.email || email,
				displayName: name,
				companyName: company,
				assignedZoneIds: [],
				createdAt: Date.now(),
				lastLogin: Date.now(),
			};

			await setDoc(doc(db, "users", user.uid), userData);

			router.push("/dashboard/profile");
		} catch (error: any) {
			setLoading(false);
			setErrorMsg(error.message);
		}
	}

	async function cancelSignUp() {
		setLoading(true);
		const user = auth.currentUser;
		if (user) {
			await user.delete();
		}
		setLoading(false);
	}

	return (
		<AuthLayout errorMsg={errorMsg} description={description}>
			<SignUpFormContent
				email={email}
				setEmail={setEmail}
				password={password}
				setPassword={setPassword}
				confirmPassword={confirmPassword}
				setConfirmPassword={setConfirmPassword}
				name={name}
				setName={setName}
				company={company}
				setCompany={setCompany}
				onSignUp={handleSignUpAuth}
				onCompleteProfile={handleCompleteProfile}
				loading={loading}
				cancelSignUp={cancelSignUp}
			/>
		</AuthLayout>
	);
}
