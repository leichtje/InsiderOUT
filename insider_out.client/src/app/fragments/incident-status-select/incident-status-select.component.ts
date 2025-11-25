import { Component, input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { IncidentStatus } from '../../models/incidents.model';
import { StatusComponent } from '../incident-status/incident-status.component';

@Component({
    selector: 'io-status-select',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        StatusComponent
    ],
    templateUrl: './incident-status-select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => StatusSelectComponent),
            multi: true
        }
    ]
})
export class StatusSelectComponent implements ControlValueAccessor {

    options = input.required<IncidentStatus[]>();
    
    value = signal<IncidentStatus | null>(null);
    isDisabled = signal(false);

    onChange = (value: IncidentStatus | null) => {};
    onTouched = () => {};

    writeValue(obj: IncidentStatus | null): void {
        this.value.set(obj);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    onSelectionChange(event: any) {
        this.value.set(event.value);
        this.onChange(event.value);
        this.onTouched();
    }
}