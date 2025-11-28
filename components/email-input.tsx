"use client";

import React from "react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";

interface EmailInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	size?: "1" | "2" | "3";
	disabled?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
	value,
	onChange,
	placeholder = "your@email.com",
	size = "3",
	disabled = false,
}) => {
	return (
		<TextField.Root
			size={size}
			type="email"
			placeholder={placeholder}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			disabled={disabled}
		>
			<TextField.Slot>
				<EnvelopeClosedIcon />
			</TextField.Slot>
		</TextField.Root>
	);
};

export default EmailInput;
