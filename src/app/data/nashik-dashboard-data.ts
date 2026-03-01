import { CasesByMonth, FoggingInstance, ZonePerformance } from './mock-dashboard-data';

export const nashikFoggingInstances: FoggingInstance[] = [
    { id: 'nf-001', zoneId: 'nashik-panchavati', zoneName: 'Panchavati (Kumbh)', date: '2025-12-06', area: 48000, duration: 190, team: 'NMC Team A', effectiveness: 72, status: 'completed' },
    { id: 'nf-002', zoneId: 'nashik-satpur', zoneName: 'Satpur Industrial', date: '2025-12-10', area: 41000, duration: 175, team: 'NMC Team B', effectiveness: 78, status: 'completed' },
    { id: 'nf-003', zoneId: 'nashik-panchavati', zoneName: 'Panchavati (Kumbh)', date: '2025-12-17', area: 48000, duration: 195, team: 'NMC Team A', effectiveness: 75, status: 'completed' },
    { id: 'nf-004', zoneId: 'nashik-old-nashik', zoneName: 'Old Nashik', date: '2025-12-22', area: 30000, duration: 145, team: 'NMC Team C', effectiveness: 80, status: 'completed' },
    { id: 'nf-005', zoneId: 'nashik-satpur', zoneName: 'Satpur Industrial', date: '2026-01-04', area: 41000, duration: 180, team: 'NMC Team B', effectiveness: 82, status: 'completed' },
    { id: 'nf-006', zoneId: 'nashik-panchavati', zoneName: 'Panchavati (Kumbh)', date: '2026-01-08', area: 48000, duration: 200, team: 'NMC Team A', effectiveness: 70, status: 'completed' },
    { id: 'nf-007', zoneId: 'nashik-trimbak', zoneName: 'Trimbakeshwar', date: '2026-01-15', area: 18000, duration: 120, team: 'NMC Team C', effectiveness: 74, status: 'completed' },
    { id: 'nf-008', zoneId: 'nashik-satpur', zoneName: 'Satpur Industrial', date: '2026-01-20', area: 41000, duration: 178, team: 'NMC Team B', effectiveness: 83, status: 'completed' },
    { id: 'nf-009', zoneId: 'nashik-panchavati', zoneName: 'Panchavati (Kumbh)', date: '2026-01-28', area: 48000, duration: 205, team: 'NMC Team A', effectiveness: 68, status: 'completed' },
    { id: 'nf-010', zoneId: 'nashik-cidco', zoneName: 'CIDCO Colony', date: '2026-02-01', area: 25000, duration: 130, team: 'NMC Team D', effectiveness: 77, status: 'completed' },
    { id: 'nf-011', zoneId: 'nashik-panchavati', zoneName: 'Panchavati (Kumbh)', date: '2026-02-06', area: 48000, duration: 195, team: 'NMC Team A', effectiveness: 73, status: 'completed' },
    { id: 'nf-012', zoneId: 'nashik-satpur', zoneName: 'Satpur Industrial', date: '2026-02-10', area: 41000, duration: 182, team: 'NMC Team B', effectiveness: 84, status: 'completed' },
    { id: 'nf-013', zoneId: 'nashik-panchavati', zoneName: 'Panchavati (Kumbh)', date: '2026-02-15', area: 48000, duration: 0, team: 'NMC Team A', effectiveness: 0, status: 'in-progress' },
    { id: 'nf-014', zoneId: 'nashik-satpur', zoneName: 'Satpur Industrial', date: '2026-02-18', area: 41000, duration: 0, team: 'NMC Team B', effectiveness: 0, status: 'scheduled' },
    { id: 'nf-015', zoneId: 'nashik-trimbak', zoneName: 'Trimbakeshwar', date: '2026-02-22', area: 18000, duration: 0, team: 'NMC Team C', effectiveness: 0, status: 'scheduled' },
];

export const nashikCasesTrend: CasesByMonth[] = [
    { month: 'Dec W1', cases: 52, deaths: 3, recovered: 43 },
    { month: 'Dec W2', cases: 61, deaths: 3, recovered: 50 },
    { month: 'Dec W3', cases: 58, deaths: 2, recovered: 52 },
    { month: 'Dec W4', cases: 70, deaths: 4, recovered: 58 },
    { month: 'Jan W1', cases: 78, deaths: 4, recovered: 63 },
    { month: 'Jan W2', cases: 74, deaths: 3, recovered: 65 },
    { month: 'Jan W3', cases: 68, deaths: 2, recovered: 61 },
    { month: 'Jan W4', cases: 65, deaths: 2, recovered: 60 },
    { month: 'Feb W1', cases: 60, deaths: 2, recovered: 56 },
    { month: 'Feb W2', cases: 55, deaths: 1, recovered: 52 },
    { month: 'Feb W3', cases: 50, deaths: 1, recovered: 48 },
];

export const nashikZonePerformance: ZonePerformance[] = [
    { zoneId: 'nashik-panchavati', zoneName: 'Panchavati (Kumbh)', cases: 98, foggingCount: 8, trapEfficiency: 58, responseTime: 5, breedingSitesEliminated: 56, riskLevel: 'high' },
    { zoneId: 'nashik-satpur', zoneName: 'Satpur Industrial', cases: 76, foggingCount: 6, trapEfficiency: 65, responseTime: 7, breedingSitesEliminated: 48, riskLevel: 'high' },
    { zoneId: 'nashik-old-nashik', zoneName: 'Old Nashik', cases: 36, foggingCount: 2, trapEfficiency: 78, responseTime: 12, breedingSitesEliminated: 22, riskLevel: 'medium' },
    { zoneId: 'nashik-cidco', zoneName: 'CIDCO Colony', cases: 28, foggingCount: 2, trapEfficiency: 82, responseTime: 15, breedingSitesEliminated: 18, riskLevel: 'medium' },
    { zoneId: 'nashik-gangapur', zoneName: 'Gangapur', cases: 10, foggingCount: 0, trapEfficiency: 91, responseTime: 28, breedingSitesEliminated: 9, riskLevel: 'low' },
    { zoneId: 'nashik-nashikroad', zoneName: 'Nashik Road', cases: 9, foggingCount: 0, trapEfficiency: 89, responseTime: 30, breedingSitesEliminated: 8, riskLevel: 'low' },
    { zoneId: 'nashik-trimbak', zoneName: 'Trimbakeshwar', cases: 31, foggingCount: 2, trapEfficiency: 72, responseTime: 20, breedingSitesEliminated: 16, riskLevel: 'medium' },
];

export const nashikResourceAllocation = {
    totalBudget: 4500000,
    spent: 2850000,
    teams: 4,
    traps: 46,
    foggingMachines: 6,
    vehicles: 5,
};
