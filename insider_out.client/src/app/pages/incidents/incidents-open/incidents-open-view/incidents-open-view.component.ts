
import { Component, EventEmitter, input, output, Output } from '@angular/core';
import { IncidentModel } from '../../../../models/incidents.model';
import { IncidentsListComponent } from "../../incidents-list/incidents-list.component";
import { FilterOptionModel, FilterValue } from '../../../../models/filter.model';
import { MatIcon } from "@angular/material/icon";
import { FilterComponent } from '../../../../fragments/incidents-filter/filter.component';

@Component({
    selector: 'io-incidents-open-view',
    templateUrl: './incidents-open-view.component.html',
    styleUrl: './incidents-open-view.component.scss',
    standalone: true,
    imports: [
    IncidentsListComponent,
    FilterComponent,
    MatIcon
]
})
export class IncidentsOpenViewComponent {

    filterUserOptions: FilterOptionModel[] = [
        { label: 'Assigned to Me', value: 'mine', icon: 'person' },
        { label: 'Unassigned', value: 'unassigned', icon: 'person_off' },
        { label: 'All Incidents', value: 'all', icon: 'list' }
    ];

    filterTypeOptions: FilterOptionModel[] = [
        { label: 'Document', value: 'document', icon: 'description' },
        { label: 'Email', value: 'email', icon: 'email' },
        { label: 'All Types', value: 'all', icon: 'list' }
    ];

    incidents = input<IncidentModel[]>();
    activeId = input<number | null>();
    
    selectedIncident = input<IncidentModel | null>();
    filterUserChange = output<FilterValue>();
    filterTypeChange = output<FilterValue>();

    @Output() incidentSelected = new EventEmitter<IncidentModel>();

    onIncidentClicked(incident: IncidentModel) {
        this.incidentSelected.emit(incident);
    }

}
