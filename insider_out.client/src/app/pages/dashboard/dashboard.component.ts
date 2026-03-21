
import { Component, inject, OnInit } from '@angular/core';
import { DashboardViewComponent } from "./dashboard-view/dashboard-view.component";
import { DashboardStore } from '../../stores/dashboard.store';

@Component({
    selector: 'io-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [DashboardViewComponent],
    providers: [DashboardStore]

})
export class DashboardComponent {

    readonly dashboardStore = inject(DashboardStore);

    

}
