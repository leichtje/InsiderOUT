import { Component } from "@angular/core";
import { IncidentStatus } from "../../models/incidents.model";
import { BasePillComponent } from "./pill.component";

@Component({
    selector: 'io-incident-status',
    templateUrl: './pill.component.html',
    styleUrl: './pill.component.scss',
    standalone: true
})
export class StatusComponent extends BasePillComponent<IncidentStatus> {

    pillVarMap = new Map<IncidentStatus, string>([
        [IncidentStatus.New, 'var(--status-new)'],
        [IncidentStatus.inProgress, 'var(--status-in-progress)'],
        [IncidentStatus.Resolved, 'var(--status-resolved)'],
        [IncidentStatus.Closed, 'var(--status-closed)'],
    ]);

    pillText = new Map<IncidentStatus, string>([
        [IncidentStatus.New, 'New'],
        [IncidentStatus.inProgress, 'In Progress'],
        [IncidentStatus.Resolved, 'Resolved'],
        [IncidentStatus.Closed, 'Closed'],
    ]);

}