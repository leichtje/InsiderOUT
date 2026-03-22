
import { Component, input } from '@angular/core';
import { IncidentModel } from '../../../models/incidents.model';
import { MatTabsModule } from '@angular/material/tabs';
import { DepartmentDashboards } from '../../../stores/dashboard.store';

@Component({
    selector: 'io-dashboard-departments-tile',
    templateUrl: './dashboard-departments-tile.component.html',
    styleUrl: './dashboard-departments-tile.component.scss',
    standalone: true,
    imports: [MatTabsModule]
})
export class DashboardDepartmentsTileComponent {

    readonly departmentDashboards$ = input.required<DepartmentDashboards[]>({alias: 'departmentDashboards'});


}
