"use client";

import AuthLayout from "../../components/auth-layout";
import SignInFormContent from "../../components/signin-form";
import { useState } from "react";

export default function Page() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const description =
		"Share your location and collaborate with other Biologists";

	// useEffect(() => {
	//     setErrorMsg("Invalid credentials. Please try again.");
	// }, []);

	return (
		<AuthLayout errorMsg={errorMsg} description={description}>
			<SignInFormContent
				email={email}
				setEmail={setEmail}
				password={password}
				setPassword={setPassword}
			/>
		</AuthLayout>
	);
}
