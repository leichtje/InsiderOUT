
import { Component, input } from '@angular/core';
import { IncidentModel } from '../../../models/incidents.model';
import { IncidentsHeatMapComponent } from "../../../fragments/incidents-heat-map/incidents-heat-map.component";

@Component({
    selector: 'io-dashboard-incidents-tile',
    templateUrl: './dashboard-incidents-tile.component.html',
    styleUrl: './dashboard-incidents-tile.component.scss',
    standalone: true,
    imports: [IncidentsHeatMapComponent]
})
export class DashboardIncidentsTileComponent {

    readonly mostRecentIncidents$ = input.required<IncidentModel[]>({alias: 'mostRecentIncidents'});
    readonly assignedIncidents$ = input.required<IncidentModel[]>({alias: 'assignedIncidents'});
    readonly allIncidents$ = input.required<IncidentModel[]>({alias: 'allIncidents'});

}
