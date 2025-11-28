"use client";

import { ReactNode } from "react";
import { IdCardIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Container, Flex, Text, Avatar, Box, Callout } from "@radix-ui/themes";

interface AuthLayoutProps {
	children: ReactNode;
	errorMsg: string | null;
	description: string;
}

export default function AuthLayout({
	children,
	errorMsg,
	description,
}: AuthLayoutProps) {
	return (
		<Flex justify="center" align="center" minHeight="90vh">
			<Container size="1">
				<Flex gap="4" direction="column">
					<Flex gap="3" direction="column">
						<Flex justify="center" align="center">
							<Avatar
								size="5"
								fallback={<IdCardIcon width="24" height="24" />}
							/>
						</Flex>
						<Text
							color="purple"
							size="5"
							weight="medium"
							align="center"
							as="div"
						>
							Location Share
						</Text>
						<Text align="center" as="div">
							{description}
						</Text>
					</Flex>

					{errorMsg && (
						<Callout.Root color="red">
							<Callout.Icon>
								<InfoCircledIcon />
							</Callout.Icon>
							<Callout.Text>{errorMsg}</Callout.Text>
						</Callout.Root>
					)}

					<Box
						style={{
							background: "var(--gray-2)",
							borderRadius: "var(--radius-4)",
						}}
						p="5"
					>
						{children}
					</Box>

					<footer>
						<Text size="1" align="center" as="div">
							All rights reserved
						</Text>
					</footer>
				</Flex>
			</Container>
		</Flex>
	);
}
