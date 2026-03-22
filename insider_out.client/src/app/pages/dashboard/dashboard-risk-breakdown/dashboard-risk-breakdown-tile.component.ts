
import { Component, input } from '@angular/core';
import { PercentRingComponent } from "../../../fragments/percent-ring/percent-ring.component";
import { DepartmentDashboards } from '../../../stores/dashboard.store';
import { SubjectModel } from '../../../models/profile.model';

@Component({
    selector: 'io-dashboard-risk-breakdown-tile',
    templateUrl: './dashboard-risk-breakdown-tile.component.html',
    styleUrl: './dashboard-risk-breakdown-tile.component.scss',
    standalone: true,
    imports: [PercentRingComponent]
})
export class DashboardRiskBreakdownComponent {

    readonly overallCompanyRisk$ = input.required<number>({alias: 'overallCompanyRisk'})
    readonly topSubjects$ = input.required<SubjectModel[] | null>({alias: 'topSubjects'})

}
