
import { Component, input } from '@angular/core';
import { PercentRingComponent } from "../../../fragments/percent-ring/percent-ring.component";

@Component({
    selector: 'io-dashboard-company-risk-tile',
    templateUrl: './dashboard-company-risk-tile.component.html',
    styleUrl: './dashboard-company-risk-tile.component.scss',
    standalone: true,
    imports: [PercentRingComponent]
})
export class DashboardCompanyRiskComponent {

    readonly overallRisk$ = input.required<number>({alias: 'overallRisk'})
}
