import { Component, input, forwardRef, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfilePickerDialogComponent, ProfilePickerData } from '../profile-picker-dialog/profile-picker-dialog.component';
import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';

@Component({
    selector: 'io-profile-picker',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, ProfileAvatarComponent],
    templateUrl: './profile-picker.component.html',
    styleUrl: './profile-picker.component.scss',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ProfilePickerComponent),
        multi: true
    }]
})
export class ProfilePickerComponent implements ControlValueAccessor {
    private dialog = inject(MatDialog);

    label = input.required<string>();
    items = input.required<any[]>();
    idKey = input.required<string>();
    nullLabel = input('Unassigned');

    value = signal<number | null>(null);
    isDisabled = signal(false);

    selectedItem = computed(() => {
        const id = this.value();
        return this.items().find(i => i[this.idKey()] === id) || null;
    });

    onChange = (_: any) => {};
    onTouched = () => {};
    
    writeValue(val: number | null) { this.value.set(val); }
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; }
    setDisabledState(d: boolean) { this.isDisabled.set(d); }

    openDialog() {
        this.onTouched();
        
        const dialogRef = this.dialog.open(ProfilePickerDialogComponent, {
        width: '900px',
        maxWidth: '95vw',
        panelClass: 'io-modal-panel',
        data: {
            title: `Select ${this.label()}`,
            items: this.items(),
            selectedId: this.value(),
            idKey: this.idKey()
        } as ProfilePickerData
        });

        dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
            const newId = result ? result[this.idKey()] : null;
            this.value.set(newId);
            this.onChange(newId);
        }
        });
    }

    clearSelection(e: Event) {
        e.stopPropagation();
        this.value.set(null);
        this.onChange(null);
    }
}