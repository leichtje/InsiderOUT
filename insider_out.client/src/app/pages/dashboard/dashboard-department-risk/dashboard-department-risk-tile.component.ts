
import { Component, input } from '@angular/core';
import { PercentRingComponent } from "../../../fragments/percent-ring/percent-ring.component";

@Component({
    selector: 'io-dashboard-department-risk-tile',
    templateUrl: './dashboard-department-risk-tile.component.html',
    styleUrl: './dashboard-department-risk-tile.component.scss',
    standalone: true,
    imports: [PercentRingComponent]
})
export class DashboardDepartmentRiskComponent {

    readonly overallDepartmentRisk$ = input.required<number>({alias: 'overallDepartmentRisk'})
}
