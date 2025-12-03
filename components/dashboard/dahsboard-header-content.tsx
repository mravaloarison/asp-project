"use client";

import DashboardListSectionHeader from "@/components/dashboard-list-header";

interface DashboardHeaderContentProps {
	currentSegment: string;
	handleSegmentChange: (v: string) => void;
}

export default function DashboardHeaderContent({
	currentSegment,
	handleSegmentChange,
}: DashboardHeaderContentProps) {
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
