"use client";

import EmailInput from "@/components/email-input";
import PasswordInput from "@/components/password-input";
import { Button, Flex, Link, Text } from "@radix-ui/themes";

interface SignInFormContentProps {
	email: string;
	setEmail: (email: string) => void;
	password: string;
	setPassword: (password: string) => void;
	// onSubmit: () => void;
}

export default function SignInFormContent({
	email,
	setEmail,
	password,
	setPassword,
}: SignInFormContentProps) {
	return (
		<Flex gap="4" direction="column">
			<Text size="4" weight="bold" align="center" as="div">
				Sign In
			</Text>

			<EmailInput
				value={email}
				onChange={setEmail}
				placeholder="Your Email"
				size="3"
				disabled={false}
			/>

			<PasswordInput
				value={password}
				onChange={setPassword}
				placeholder="Your Password"
				size="3"
			/>

			<Button size="3">Sign In</Button>

			<Text align="center" as="div">
				Don't have an account yet? <Link href="/signup">Sign Up</Link>
			</Text>
		</Flex>
	);
}
