
import { Component, input } from '@angular/core';
import { PercentRingComponent } from "../../../fragments/percent-ring/percent-ring.component";
import { DepartmentDashboards } from '../../../stores/dashboard.store';

@Component({
    selector: 'io-dashboard-department-risk-tile',
    templateUrl: './dashboard-department-risk-tile.component.html',
    styleUrl: './dashboard-department-risk-tile.component.scss',
    standalone: true,
    imports: [PercentRingComponent]
})
export class DashboardDepartmentRiskComponent {

    readonly topDepartmentRisk$ = input.required<DepartmentDashboards | null>({alias: 'topDepartmentRisk'})
}
