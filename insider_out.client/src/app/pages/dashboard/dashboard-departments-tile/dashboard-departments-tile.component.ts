
import { Component, input, signal } from '@angular/core';
import { IncidentModel } from '../../../models/incidents.model';
import { MatTabsModule } from '@angular/material/tabs';
import { DepartmentDashboards } from '../../../stores/dashboard.store';
import { AppRoutingModule } from "../../../app-routing.module";
import { RouterLink } from '@angular/router';
import { PercentRingComponent } from "../../../fragments/percent-ring/percent-ring.component";

@Component({
    selector: 'io-dashboard-departments-tile',
    templateUrl: './dashboard-departments-tile.component.html',
    styleUrl: './dashboard-departments-tile.component.scss',
    standalone: true,
    imports: [MatTabsModule, RouterLink, PercentRingComponent]
})
export class DashboardDepartmentsTileComponent {

    readonly departmentDashboards$ = input.required<DepartmentDashboards[]>({alias: 'departmentDashboards'});

    expandedDepartmentId = signal<number | null>(null);

    toggleDepartment(id: number) {
        this.expandedDepartmentId.update(currentId => currentId === id ? null : id);
    }
}
