"use client";

import { useState, useMemo } from "react";
import { Card, Box } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import DashboardViewHeader from "./dashboard/dahsboard-view-header";
import DashboardBodyContent from "./dashboard/dashboard-body-content";
import DashboardHeaderContent from "./dashboard/dahsboard-header-content";

const getPathSegments = (pathname: string) =>
	pathname.split("/").filter((s) => s);

export default function DashboardSidebar() {
	const router = useRouter();
	const pathname = usePathname();

	const segments = getPathSegments(pathname);
	const segmentType = segments[1] as "user" | "zone" | undefined;
	const segmentId = segments[2];
	const isZoneUserView = segments.length === 5 && segments[3] === "user";

	const VIEW_STATE = useMemo(() => {
		if (isZoneUserView) return "ZONE_USER_READ_ONLY";
		if (segmentType === "user" && segmentId) return "USER_READ_ONLY";
		if (segmentType === "zone" && segmentId) return "ZONE_MEMBERS";
		if (segmentType === "user" || segmentType === "zone")
			return "MAIN_LIST";
		return "MAIN_DASHBOARD";
	}, [segmentType, segmentId, isZoneUserView]);

	const [currentSegment, setCurrentSegment] = useState<string>(
		segmentType === "zone" ? "zones" : "users"
	);

	const [direction, setDirection] = useState(0);

	const zoneId = segmentType === "zone" ? segmentId : undefined;
	const userId =
		VIEW_STATE === "USER_READ_ONLY" || isZoneUserView
			? segments[isZoneUserView ? 4 : 2]
			: undefined;
	const selectedZoneName = zoneId ? `Zone ${zoneId}` : undefined;
	const selectedUserData = userId
		? {
				name: `User ${userId}`,
				company: selectedZoneName || `Company ${userId}`,
		  }
		: undefined;

	const navigateToZone = (id: number) => {
		setDirection(1);
		router.push(`/dashboard/zone/${id}`);
	};

	const navigateToUserFromList = (id: number) => {
		setDirection(1);
		router.push(`/dashboard/user/${id}`);
	};

	const navigateToUserFromZone = (zoneId: string, userId: number) => {
		setDirection(1);
		router.push(`/dashboard/zone/${zoneId}/user/${userId}`);
	};

	const goBack = () => {
		setDirection(-1);

		if (VIEW_STATE === "ZONE_USER_READ_ONLY") {
			const zonePath = segments.slice(0, 3).join("/");
			router.push(`/${zonePath}`);
		} else if (VIEW_STATE === "USER_READ_ONLY") {
			router.push("/dashboard/user");
		} else if (VIEW_STATE === "ZONE_MEMBERS") {
			router.push("/dashboard/zone");
		}
	};

	const handleSegmentChange = (v: string) => {
		setCurrentSegment(v);
		const newPath = v === "users" ? "/dashboard/user" : "/dashboard/zone";
		router.push(newPath);
	};

	const bodyVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? "100%" : "-100%",
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? "100%" : "-100%",
			opacity: 0,
		}),
	};

	const motionKey = segments.join("-");

	return (
		<Card
			size="2"
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				minWidth: 0,
				overflow: "hidden",
			}}
		>
			<Box
				style={{
					flexShrink: 0,
					zIndex: 10,
					backgroundColor: "var(--color-panel-solid)",
				}}
			>
				<DashboardHeaderContent
					currentSegment={currentSegment}
					handleSegmentChange={handleSegmentChange}
				/>
				<DashboardViewHeader
					viewState={VIEW_STATE}
					selectedZoneName={selectedZoneName}
					goBack={goBack}
				/>
			</Box>
			<Box
				style={{
					flexGrow: 1,
					position: "relative",
					overflow: "hidden",
				}}
			>
				<AnimatePresence
					initial={false}
					custom={direction}
					mode="popLayout"
				>
					<motion.div
						key={motionKey}
						custom={direction}
						variants={bodyVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 },
						}}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							overflowY: "auto",
							paddingRight: "var(--space-1)",
						}}
					>
						<DashboardBodyContent
							viewState={VIEW_STATE}
							currentSegment={currentSegment}
							selectedZoneName={selectedZoneName}
							zoneId={zoneId}
							selectedUserData={selectedUserData}
							navigateToZone={navigateToZone}
							navigateToUserFromList={navigateToUserFromList}
							navigateToUserFromZone={navigateToUserFromZone}
						/>
					</motion.div>
				</AnimatePresence>
			</Box>
		</Card>
	);
}
