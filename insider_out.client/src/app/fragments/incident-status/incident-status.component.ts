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

    private themeService = inject(ThemeService);

    private statusLightColors = new Map<IncidentStatus, string>([
        [IncidentStatus.New, '#A5D6A7'],        // Light Green
        [IncidentStatus.inProgress, '#a7dbf3ff'], // Light Blue
        [IncidentStatus.Resolved, '#FFCC80'],    // Light Orange
        [IncidentStatus.Closed, '#CFD8DC'],       // Blue Grey
    ]);

    private statusDarkColors = new Map<IncidentStatus, string>([
        [IncidentStatus.New, '#2f9232ff'],        // Dark Green
        [IncidentStatus.inProgress, '#306a84ff'], // Dark Blue
        [IncidentStatus.Resolved, '#a87b38ff'],    // Dark Orange
        [IncidentStatus.Closed, '#4e6770ff'],       // Dark Grey
    ]);

    private statusText = new Map<IncidentStatus, string>([
        [IncidentStatus.New, 'New'],
        [IncidentStatus.inProgress, 'In Progress'],
        [IncidentStatus.Resolved, 'Resolved'],
        [IncidentStatus.Closed, 'Closed'],
    ]);

    status = input<IncidentStatus>();

    isDark = computed(() => this.themeService.isDark());

    backgroundColor = computed(() => {
        const currentStatus = this.status();
        const colorPalette = this.isDark() ? this.statusDarkColors : this.statusLightColors;

        const defaultColor = this.isDark() ? '#424242' : '#BDBDBD';
        
        if (currentStatus === undefined) {
            return defaultColor;
        }
        
        return colorPalette.get(currentStatus) ?? defaultColor;
    });

    displayText = computed(() => {
        const currentStatus = this.status();
        if (currentStatus === undefined) {
            return 'Unknown';
        }
        return this.statusText.get(currentStatus) ?? 'Unknown';
    });

    @HostBinding('style.--background-color')
    get bindBackgroundColor() {
        return this.backgroundColor();
    }

}