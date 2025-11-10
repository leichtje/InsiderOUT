import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { IncidentsModel } from '../../../../models/incidents.model';
import { IncidentsOpenListComponent } from "../incidents-open-list/incidents-open-list.component";

@Component({
    selector: 'io-incidents-open-view',
    templateUrl: './incidents-open-view.component.html',
    styleUrl: './incidents-open-view.component.scss',
    standalone: true,
    imports: [CommonModule, IncidentsOpenListComponent]
})
export class IncidentsOpenViewComponent {

    incidents = input<IncidentsModel[]>();
    activeId = input<number | null>();
    
    selectedIncident = input<IncidentsModel | null>();

    @Output() incidentSelected = new EventEmitter<IncidentsModel>();

    onIncidentClicked(incident: IncidentsModel) {
        this.incidentSelected.emit(incident);
    }

}
