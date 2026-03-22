import { Component, input } from "@angular/core";
import { IncidentModel } from "../../models/incidents.model";

@Component({
    selector: 'io-incidents-heat-map',
    templateUrl: './incidents-heat-map.component.html',
    styleUrl: './incidents-heat-map.component.scss',
    standalone: true,
    imports: []
})
export class IncidentsHeatMapComponent {

    readonly allIncidents$ = input.required<IncidentModel[]>({alias: 'allIncidents'});

}
