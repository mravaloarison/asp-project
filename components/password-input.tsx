"use client";

import React, { useState } from "react";
import {
	LockClosedIcon,
	EyeOpenIcon,
	EyeClosedIcon,
} from "@radix-ui/react-icons";
import { TextField, IconButton } from "@radix-ui/themes";

interface PasswordInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	size?: "1" | "2" | "3";
}

const PasswordInput: React.FC<PasswordInputProps> = ({
	value,
	onChange,
	placeholder = "Password",
	size = "3",
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<TextField.Root
			size={size}
			type={showPassword ? "text" : "password"}
			placeholder={placeholder}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		>
			<TextField.Slot>
				<LockClosedIcon />
			</TextField.Slot>

			<TextField.Slot>
				<IconButton
					size="2"
					variant="ghost"
					onClick={() => setShowPassword((prev) => !prev)}
				>
					{showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
				</IconButton>
			</TextField.Slot>
		</TextField.Root>
	);
};

export default PasswordInput;
