import { Component, input, forwardRef, signal, computed, inject } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfilePickerDialogComponent, ProfilePickerData } from '../profile-picker-dialog/profile-picker-dialog.component';
import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';
import { UserService } from '../../services/user.service';
import { ResponsiveDialogService } from '../../services/responsive-dialog.service';

@Component({
    selector: 'io-profile-picker',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, ProfileAvatarComponent],
    templateUrl: './profile-picker.component.html',
    styleUrl: './profile-picker.component.scss',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ProfilePickerComponent),
        multi: true
    }]
})
export class ProfilePickerComponent implements ControlValueAccessor {
private dialog = inject(ResponsiveDialogService);
    private userService = inject(UserService);

    label = input.required<string>();
    items = input.required<any[]>();
    idKey = input.required<string>();
    hideDetail = input<boolean>(false);
    nullLabel = input('Unassigned');
    enableAssignMe = input(false);

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

    assignToMe(event: Event) {
        event.stopPropagation(); 
        
        const currentUser = this.userService.currentUser();
        if (!currentUser) return;

        const myId = currentUser.userId; 

        const exists = this.items().some(i => i[this.idKey()] === myId);
        
        if (exists) {
            this.value.set(myId);
            this.onChange(myId);
        }
    }
}