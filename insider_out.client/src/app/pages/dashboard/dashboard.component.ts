
import { Component, OnInit } from '@angular/core';
import { DashboardViewComponent } from "./dashboard-view/dashboard-view.component";

@Component({
    selector: 'io-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [DashboardViewComponent]
})
export class DashboardComponent {

}
