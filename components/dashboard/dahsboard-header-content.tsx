"use client";

import DashboardListSectionHeader from "@/components/dashboard-list-header";

interface DashboardHeaderContentProps {
	currentSegment: string;
	handleSegmentChange: (v: string) => void;
	search: string;
	setSearch: (v: string) => void;
	totalFound: number;
}

export default function DashboardHeaderContent({
	currentSegment,
	handleSegmentChange,
	search,
	setSearch,
	totalFound,
}: DashboardHeaderContentProps) {
	return (
		<DashboardListSectionHeader
			currentSegment={currentSegment}
			setCurrentSegment={handleSegmentChange}
			search={search}
			setSearch={setSearch}
			totalFound={totalFound}
		/>
	);
}
