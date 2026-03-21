
import { Component, input } from '@angular/core';
import { PercentRingComponent } from "../../../fragments/percent-ring/percent-ring.component";

@Component({
    selector: 'io-dashboard-company-risk',
    templateUrl: './dashboard-company-risk.component.html',
    styleUrl: './dashboard-company-risk.component.scss',
    standalone: true,
    imports: [PercentRingComponent]
})
export class DashboardViewComponent {

    readonly overallRisk$ = input.required<number>({alias: 'overallRisk'})
}
