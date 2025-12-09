"use client";

import EmailInput from "@/components/email-input";
import PasswordInput from "@/components/password-input";
import { Grid, TextField } from "@radix-ui/themes";
import { CheckIcon, PersonIcon, BackpackIcon } from "@radix-ui/react-icons";
import { Avatar, Button, Flex, Link, Progress, Text } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface SignUpFormContentProps {
	email: string;
	setEmail: (email: string) => void;
	password: string;
	setPassword: (password: string) => void;
	confirmPassword: string;
	setConfirmPassword: (password: string) => void;
	name: string;
	setName: (name: string) => void;
	company: string;
	setCompany: (company: string) => void;
	onSignUp: () => Promise<void>;
	onCompleteProfile: () => Promise<void>;
	loading: boolean;
	cancelSignUp: () => Promise<void>;
}

const slideVariants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 300 : -300,
		opacity: 0,
	}),
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => ({
		zIndex: 0,
		x: direction < 0 ? 300 : -300,
		opacity: 0,
	}),
};

export default function SignUpFormContent({
	email,
	setEmail,
	password,
	setPassword,
	confirmPassword,
	setConfirmPassword,
	name,
	setName,
	company,
	setCompany,
	onSignUp,
	onCompleteProfile,
	loading,
	cancelSignUp,
}: SignUpFormContentProps) {
	const [step, setStep] = useState(1);
	const [direction, setDirection] = useState(0);

	const isStepTwo = step === 2;

	function handleNext() {
		setDirection(1);
		setStep(2);
	}

	function handleBack() {
		setDirection(-1);
		cancelSignUp();
		setStep(1);
	}

	async function actionCalled() {
		if (step === 1) {
			try {
				await onSignUp();
				handleNext();
			} catch (error) {
				console.log("Sign up failed, staying on step 1");
			}
		} else {
			try {
				await onCompleteProfile();
			} catch (error) {
				console.log("Profile save failed");
			}
		}
	}

	const progressValue = isStepTwo ? 100 : 0;
	const buttonText = isStepTwo ? "Submit" : "Next";
	const headerTitle = isStepTwo ? "Personal Info" : "Credential";

	const StepOneFields = (
		<>
			<EmailInput
				value={email}
				onChange={setEmail}
				placeholder="Your Email"
				size="3"
				disabled={loading}
			/>
			<PasswordInput
				value={password}
				onChange={setPassword}
				placeholder="Your Password"
				size="3"
				disabled={loading}
			/>
			<PasswordInput
				value={confirmPassword}
				onChange={setConfirmPassword}
				placeholder="Confirm Password"
				size="3"
				disabled={loading}
			/>
		</>
	);

	const StepTwoFields = (
		<>
			<TextField.Root
				size="3"
				placeholder="Full Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				disabled={loading}
			>
				<TextField.Slot>
					<PersonIcon />
				</TextField.Slot>
			</TextField.Root>
			<TextField.Root
				size="3"
				placeholder="Company Name"
				value={company}
				onChange={(e) => setCompany(e.target.value)}
				disabled={loading}
			>
				<TextField.Slot>
					<BackpackIcon />
				</TextField.Slot>
			</TextField.Root>
		</>
	);

	return (
		<Flex gap="4" direction="column">
			<Flex gap="3" justify="center" align="center">
				<Avatar
					variant="solid"
					size="3"
					fallback={
						isStepTwo ? <CheckIcon width="20" height="20" /> : "1"
					}
				/>
				<Text>Credential</Text>
				<Progress
					value={progressValue}
					duration="60s"
					style={{ width: 100 }}
				/>
				<Avatar
					size="3"
					variant={isStepTwo ? "solid" : "soft"}
					fallback="2"
				/>
				<Text>Personal Info</Text>
			</Flex>

			<Text size="4" weight="bold" align="center" as="div">
				{headerTitle}
			</Text>

			<div
				style={{
					position: "relative",
					overflow: "hidden",
					minHeight: "150px",
				}}
			>
				<AnimatePresence initial={false} custom={direction}>
					<motion.div
						key={step}
						custom={direction}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 },
						}}
						style={{
							position: "absolute",
							width: "100%",
							paddingTop: "4px",
						}}
					>
						<Flex direction="column" gap="3">
							{isStepTwo ? StepTwoFields : StepOneFields}
						</Flex>
					</motion.div>
				</AnimatePresence>
			</div>

			<Grid gap="3" columns={isStepTwo ? "2" : "1"}>
				{isStepTwo && (
					<Button
						variant="soft"
						onClick={handleBack}
						size="3"
						disabled={loading}
					>
						Back
					</Button>
				)}
				<Button size="3" onClick={actionCalled} loading={loading}>
					{buttonText}
				</Button>
			</Grid>

			<Text align="center" as="div" size="2">
				Already have an account? <Link href="/signin">Sign In</Link>
			</Text>
		</Flex>
	);
}
