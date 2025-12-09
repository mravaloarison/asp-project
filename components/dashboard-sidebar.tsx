"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, Box } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import DashboardViewHeader from "./dashboard/dahsboard-view-header";
import DashboardBodyContent from "./dashboard/dashboard-body-content";
import DashboardHeaderContent from "./dashboard/dahsboard-header-content";
import {
	getAllUsers,
	getAllZones,
	getAllLocations,
} from "@/app/firestore-fetch";
import { UserDocument, ZoneDocument, LocationDocument } from "@/app/firestore";

const getPathSegments = (pathname: string) =>
	pathname.split("/").filter((s) => s);

export default function DashboardSidebar() {
	const router = useRouter();
	const pathname = usePathname();

	const [users, setUsers] = useState<UserDocument[]>([]);
	const [zones, setZones] = useState<ZoneDocument[]>([]);
	const [locations, setLocations] = useState<LocationDocument[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		async function loadData() {
			try {
				const [uRes, zRes, lRes] = await Promise.allSettled([
					getAllUsers(),
					getAllZones(),
					getAllLocations(),
				]);

				if (uRes.status === "fulfilled") setUsers(uRes.value);
				else console.error("Users fetch failed", uRes.reason);

				if (zRes.status === "fulfilled") setZones(zRes.value);
				else console.error("Zones fetch failed", zRes.reason);

				if (lRes.status === "fulfilled") setLocations(lRes.value);
				else console.error("Locations fetch failed", lRes.reason);
			} catch (e) {
				console.error("Critical fetch error", e);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	const filteredUsers = useMemo(() => {
		if (!search) return users;
		const lower = search.toLowerCase();
		return users.filter(
			(u) =>
				u.displayName.toLowerCase().includes(lower) ||
				u.email.toLowerCase().includes(lower) ||
				u.companyName?.toLowerCase().includes(lower)
		);
	}, [users, search]);

	const filteredZones = useMemo(() => {
		if (!search) return zones;
		const lower = search.toLowerCase();
		return zones.filter(
			(z) =>
				z.name.toLowerCase().includes(lower) ||
				z.region.toLowerCase().includes(lower)
		);
	}, [zones, search]);

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

	const selectedZone = zones.find((z) => z.id === zoneId);
	const selectedUser = users.find((u) => u.uid === userId);

	const selectedZoneName = selectedZone?.name;

	const navigateToZone = (id: string) => {
		setDirection(1);
		router.push(`/dashboard/zone/${id}`);
	};

	const navigateToUserFromList = (id: string) => {
		setDirection(1);
		router.push(`/dashboard/user/${id}`);
	};

	const navigateToUserFromZone = (zId: string, uId: string) => {
		setDirection(1);
		router.push(`/dashboard/zone/${zId}/user/${uId}`);
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

	const motionKey = segments.join("-") + currentSegment;

	return (
		<Card
			size="2"
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				minWidth: 0,
				overflow: "hidden",
				padding: 0,
			}}
		>
			<Box
				style={{
					flexShrink: 0,
					zIndex: 10,
					backgroundColor: "var(--color-panel-solid)",
					padding: "var(--space-3)",
					borderBottom: "1px solid var(--gray-a4)",
				}}
			>
				<DashboardHeaderContent
					currentSegment={currentSegment}
					handleSegmentChange={handleSegmentChange}
					search={search}
					setSearch={setSearch}
					totalFound={
						currentSegment === "users"
							? filteredUsers.length
							: filteredZones.length
					}
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
							padding: "var(--space-3)",
						}}
					>
						{!loading && (
							<DashboardBodyContent
								viewState={VIEW_STATE}
								currentSegment={currentSegment}
								selectedZoneName={selectedZoneName}
								zoneId={zoneId}
								selectedUser={selectedUser}
								users={filteredUsers}
								zones={filteredZones}
								locations={locations}
								navigateToZone={navigateToZone}
								navigateToUserFromList={navigateToUserFromList}
								navigateToUserFromZone={navigateToUserFromZone}
							/>
						)}
					</motion.div>
				</AnimatePresence>
			</Box>
		</Card>
	);
}
