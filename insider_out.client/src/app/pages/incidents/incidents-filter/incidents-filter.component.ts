import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FilterOptionModel, FilterValue } from '../../../models/filter.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'io-incidents-filter',
    standalone: true,
    imports: [MatFormFieldModule, MatSelectModule, FormsModule, MatIconModule, MatButtonModule],
    templateUrl: './incidents-filter.component.html',
    styleUrl: './incidents-filter.component.scss'
})
export class IncidentsFilterComponent {

    filterOptions = input<FilterOptionModel[]>([]);

    filterTitle = input<string>('');

    filterChanged = output<FilterValue>();

    selectedFilter = signal<FilterValue>('all');

    onFilterChange(newValue: FilterValue) {
        this.selectedFilter.set(newValue);
        this.filterChanged.emit(newValue);
    }

    resetFilter(event: Event) {
        event.stopPropagation(); 
        this.onFilterChange('all');
    }
}