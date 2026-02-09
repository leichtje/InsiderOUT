import { IncidentStatus } from "../../models/incidents.model";

export const status_colors = new Map<IncidentStatus, string>([
    [IncidentStatus.New, 'var(--status-new)'],
    [IncidentStatus.inProgress, 'var(--status-in-progress)'],
    [IncidentStatus.Resolved, 'var(--status-resolved)'],
    [IncidentStatus.Closed, 'var(--status-closed)'],
]);

export const status_text = new Map<IncidentStatus, string>([
    [IncidentStatus.New, 'New'],
    [IncidentStatus.inProgress, 'In Progress'],
    [IncidentStatus.Resolved, 'Resolved'],
    [IncidentStatus.Closed, 'Closed'],
]);
