"use client";

import DashboardListSectionHeader from "@/components/dashboard-list-header";

interface DashboardHeaderContentProps {
	viewState: string;
	currentSegment: string;
	handleSegmentChange: (v: string) => void;
}

export default function DashboardHeaderContent({
	viewState,
	currentSegment,
	handleSegmentChange,
}: DashboardHeaderContentProps) {
	if (viewState === "MAIN_LIST" || viewState === "MAIN_DASHBOARD") {
		return (
			<DashboardListSectionHeader
				currentSegment={currentSegment}
				setCurrentSegment={handleSegmentChange}
				search=""
				setSearch={() => {}}
				totalFound={12}
			/>
		);
	}
	return null;
}
