import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FilterOptionModel, FilterValue } from '../../models/filter.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'io-filter',
    standalone: true,
    imports: [MatFormFieldModule, MatSelectModule, FormsModule, MatIconModule, MatButtonModule],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss'
})
export class FilterComponent {

    readonly filterOptions$ = input<FilterOptionModel[]>([], {alias: 'filterOptions'});
    readonly filterTitle$ = input<string>('', {alias: 'filterTitle'});

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