import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FilterOptionModel, FilterValue } from '../../../models/filter.model';

@Component({
    selector: 'io-incidents-filter',
    standalone: true,
    imports: [MatFormFieldModule, MatSelectModule, FormsModule, MatIconModule],
    templateUrl: './incidents-filter.component.html',
    styleUrl: './incidents-filter.component.scss'
})
export class IncidentsFilterComponent {

    filterOptions: FilterOptionModel[] = [
        { label: 'Assigned to Me', value: 'mine',       icon: 'person' },
        { label: 'Unassigned',     value: 'unassigned', icon: 'person_off' },
        { label: 'All Incidents',  value: 'all',        icon: 'list' }
    ];

    filterChanged = output<FilterValue>();

    selectedFilter = signal<FilterValue>('all');

    onFilterChange(newValue: FilterValue) {
        this.selectedFilter.set(newValue);
        this.filterChanged.emit(newValue);
    }
}