"use client";

import AuthLayout from "../../components/auth-layout";
import SignUpFormContent from "../../components/signup-form";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Page() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const description = "Create your account to get started.";

	async function handleSignUp() {
		if (!email || !password || !confirmPassword) {
			setErrorMsg(
				"Please enter email, password, and confirm your password."
			);
			return;
		}

		if (password !== confirmPassword) {
			setErrorMsg("Passwords do not match.");
			return;
		}

		setErrorMsg(null);
		setLoading(true);

		try {
			await createUserWithEmailAndPassword(auth, email, password);
		} catch (error: any) {
			setErrorMsg(error.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<AuthLayout errorMsg={errorMsg} description={description}>
			<SignUpFormContent
				email={email}
				setEmail={setEmail}
				password={password}
				setPassword={setPassword}
			/>
		</AuthLayout>
	);
}
