import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, output, Output } from '@angular/core';
import { IncidentModel } from '../../../../models/incidents.model';
import { IncidentsListComponent } from "../../incidents-list/incidents-list.component";
import { IncidentsFilterComponent } from "../../incidents-filter/incidents-filter.component";
import { FilterValue } from '../../../../models/filter.model';

@Component({
    selector: 'io-incidents-open-view',
    templateUrl: './incidents-open-view.component.html',
    styleUrl: './incidents-open-view.component.scss',
    standalone: true,
    imports: [
    CommonModule,
    IncidentsListComponent,
    IncidentsFilterComponent
]
})
export class IncidentsOpenViewComponent {

    incidents = input<IncidentModel[]>();
    activeId = input<number | null>();
    
    selectedIncident = input<IncidentModel | null>();
    filterChange = output<FilterValue>();

    @Output() incidentSelected = new EventEmitter<IncidentModel>();

    onIncidentClicked(incident: IncidentModel) {
        this.incidentSelected.emit(incident);
    }

}
