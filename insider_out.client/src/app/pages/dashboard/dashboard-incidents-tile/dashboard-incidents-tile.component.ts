
import { Component, input } from '@angular/core';
import { IncidentModel } from '../../../models/incidents.model';
import { MatTabsModule } from '@angular/material/tabs';
import { IncidentsHeatMapComponent } from "../../../fragments/incidents-heat-map/incidents-heat-map.component";
import { PillComponent } from "../../../fragments/pill/pill.component";
import { status_colors, status_text } from '../../../fragments/pill/incident-status-constants';
import { AppRoutingModule } from "../../../app-routing.module";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'io-dashboard-incidents-tile',
    templateUrl: './dashboard-incidents-tile.component.html',
    styleUrl: './dashboard-incidents-tile.component.scss',
    standalone: true,
    imports: [MatTabsModule, IncidentsHeatMapComponent, PillComponent, RouterLink]
})
export class DashboardIncidentsTileComponent {

    readonly recentIncidents$ = input.required<IncidentModel[]>({alias: 'recentIncidents'});
    readonly assignedIncidents$ = input.required<IncidentModel[]>({alias: 'assignedIncidents'});
    readonly allIncidents$ = input.required<IncidentModel[]>({alias: 'allIncidents'});

    statusColors = status_colors;
    statusText = status_text;

}
