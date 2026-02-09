import { Component, input, forwardRef, signal, computed, inject } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfilePickerDialogComponent, ProfilePickerData } from '../profile-picker-dialog/profile-picker-dialog.component';
import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';
import { ResponsiveDialogService } from '../../services/responsive-dialog.service';
import { UserStore } from '../../stores/user.store';

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
    protected userStore = inject(UserStore); 

    readonly label$ = input.required<string>({alias: 'label'});
    readonly items$ = input.required<any[]>({alias: 'items'});
    readonly idKey$ = input.required<string>({alias: 'idKey'});
    readonly hideDetail$ = input<boolean>(false, {alias: 'hideDetail'});
    readonly nullLabel$ = input('Unassigned', {alias: 'nullLabel'});
    readonly enableAssignMe$ = input(false, {alias: 'enableAssignMe'});

    value = signal<number | null>(null);
    isDisabled = signal(false);

    selectedItem = computed(() => {
        const id = this.value();
        return this.items$().find(i => i[this.idKey$()] === id) || null;
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
            title: `Select ${this.label$()}`,
            items: this.items$(),
            selectedId: this.value(),
            idKey: this.idKey$()
        } as ProfilePickerData
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                const newId = result ? result[this.idKey$()] : null;
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
        
        const currentUser = this.userStore.currentUser();
        if (!currentUser) return;

        const myId = currentUser.userId; 

        const exists = this.items$().some(i => i[this.idKey$()] === myId);
        
        if (exists) {
            this.value.set(myId);
            this.onChange(myId);
        }
    }
}