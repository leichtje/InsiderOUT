import { Component, input, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ProfileAvatarComponent } from '../../profile-avatar/profile-avatar.component';

@Component({
    selector: 'io-profile-select',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        FormsModule, 
        ProfileAvatarComponent
    ],
    templateUrl: './profile-select.component.html',
    styleUrl: './profile-select.component.scss',
    providers: [
        {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ProfileSelectComponent),
        multi: true
        }
    ]
})
export class ProfileSelectComponent implements ControlValueAccessor {

    label = input.required<string>();
    items = input.required<any[]>();
    idKey = input.required<string>();
    nullLabel = input('Unassigned');

    value = signal<number | null>(null);
    isDisabled = signal(false);

    selectedItem = computed(() => {
        const currentId = this.value();
        const list = this.items();
        const key = this.idKey();
        
        if (!currentId || !list) return null;
        return list.find(item => item[key] === currentId) || null;
    });

    onChange = (value: number | null) => {};
    
    onTouched = () => {};

    writeValue(obj: number | null): void {
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