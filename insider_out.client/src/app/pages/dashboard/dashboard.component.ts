
import { Component, inject, OnInit } from '@angular/core';
import { DashboardStore } from '../../stores/dashboard.store';
import { DashboardCompanyRiskComponent } from './dashboard-company-risk/dashboard-company-risk-tile.component';
import { DashboardIncidentsTileComponent } from "./dashboard-incidents-tile/dashboard-incidents-tile.component";
import { IncidentStore } from '../../stores/incident.store';
import { DashboardDepartmentsTileComponent } from "./dashboard-departments-tile/dashboard-departments-tile.component";
import { DashboardDepartmentRiskComponent } from "./dashboard-department-risk/dashboard-department-risk-tile.component";

@Component({
    selector: 'io-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    standalone: true,
    imports: [DashboardCompanyRiskComponent, DashboardIncidentsTileComponent, DashboardDepartmentsTileComponent, DashboardDepartmentRiskComponent],
    providers: [DashboardStore]

})
export class DashboardComponent {

    readonly dashboardStore = inject(DashboardStore);
    readonly incidentsStore = inject(IncidentStore);


}
