import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
	title: "Aspinall Tana Report",
	description:
		"A reporting Web App built for Aspinall Foundation's team in Antananarivo",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Theme
					accentColor="violet"
					grayColor="gray"
					panelBackground="solid"
					scaling="100%"
					radius="full"
				>
					{children}
				</Theme>
			</body>
		</html>
	);
}
