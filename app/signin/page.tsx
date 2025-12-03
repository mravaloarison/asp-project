"use client";

import AuthLayout from "../../components/auth-layout";
import SignInFormContent from "../../components/signin-form";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";

export default function Page() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const description =
		"Share your location and collaborate with other Biologists";

	async function handleSignIn() {
		if (!email || !password) {
			setErrorMsg("Please enter both email and password.");
			return;
		}

		setErrorMsg(null);
		setLoading(true);

		try {
			await signInWithEmailAndPassword(auth, email, password);
			router.push("/dashboard/user");
		} catch (error: any) {
			setErrorMsg(error.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<AuthLayout errorMsg={errorMsg} description={description}>
			<SignInFormContent
				email={email}
				setEmail={setEmail}
				password={password}
				setPassword={setPassword}
				onSignIn={handleSignIn}
				loading={loading}
			/>
		</AuthLayout>
	);
}
