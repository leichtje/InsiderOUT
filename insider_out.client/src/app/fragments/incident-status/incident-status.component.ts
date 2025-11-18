import { Component, computed, inject, input, HostBinding } from "@angular/core";
import { ThemeService } from "../../services/theme.service";
import { IncidentStatus } from "../../models/incidents.model";

@Component({
    selector: 'io-incident-status',
    templateUrl: './incident-status.component.html',
    styleUrl: './incident-status.component.scss',
    standalone: true
})
export class StatusComponent {

private statusVarMap = new Map<IncidentStatus, string>([
        [IncidentStatus.New,        'var(--status-new)'],
        [IncidentStatus.inProgress, 'var(--status-in-progress)'],
        [IncidentStatus.Resolved,   'var(--status-resolved)'],
        [IncidentStatus.Closed,     'var(--status-closed)'],
    ]);

    private statusText = new Map<IncidentStatus, string>([
        [IncidentStatus.New,        'New'],
        [IncidentStatus.inProgress, 'In Progress'],
        [IncidentStatus.Resolved,   'Resolved'],
        [IncidentStatus.Closed,     'Closed'],
    ]);

    status = input<IncidentStatus>();

    backgroundColor = computed(() => {
        const currentStatus = this.status();
        
        if (currentStatus === undefined) {
            return 'var(--color-gray-2)';
        }
        
        return this.statusVarMap.get(currentStatus) ?? 'var(--color-gray-2)';
    });

    displayText = computed(() => {
        const currentStatus = this.status();
        
        if (currentStatus === null || currentStatus === undefined) {
            return 'Unknown';
        }
        
        return this.statusText.get(currentStatus) ?? 'Unknown';
    });

    @HostBinding('style.--background-color')
    get bindBackgroundColor() {
        return this.backgroundColor();
    }

}