"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DashboardSelectionContextValue {
    focusedLocationId: string | null;
    setFocusedLocationId: (id: string | null) => void;
}

const DashboardSelectionContext = createContext<DashboardSelectionContextValue | undefined>(undefined);

export function DashboardSelectionProvider({ children }: { children: ReactNode }) {
    const [focusedLocationId, setFocusedLocationId] = useState<string | null>(null);

    return (
        <DashboardSelectionContext.Provider value={{ focusedLocationId, setFocusedLocationId }}>
            {children}
        </DashboardSelectionContext.Provider>
    );
}

export function useDashboardSelection() {
    const ctx = useContext(DashboardSelectionContext);
    if (!ctx) {
        throw new Error("useDashboardSelection must be used within a DashboardSelectionProvider");
    }
    return ctx;
}
