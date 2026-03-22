
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

    readonly topDepartments$ = input.required<DepartmentDashboards[] | null>({alias: 'topDepartments'})
    readonly topSubjects$ = input.required<SubjectModel[] | null>({alias: 'topSubjects'})

}
