import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';
import { ProfileCardComponent } from '../profile-card/profile-card.component';

export interface ProfilePickerData {
    title: string;
    items: any[];
    selectedId: number | null;
    idKey: string;
}

@Component({
    selector: 'io-profile-picker-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule, 
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule, 
        MatIconModule,
        MatListModule,
        ProfileAvatarComponent,
        ProfileCardComponent
    ],
    templateUrl: './profile-picker-dialog.component.html',
    styleUrl: './profile-picker-dialog.component.scss'
})
export class ProfilePickerDialogComponent {
    
    private dialogRef = inject(MatDialogRef<ProfilePickerDialogComponent>);
    public data = inject<ProfilePickerData>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);

    filterForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        email: [''],
        department: ['']
    });

    filters = toSignal(this.filterForm.valueChanges, { initialValue: this.filterForm.value });

    filteredItems = computed(() => {
        const criteria = this.filters();
        const rawList = this.data.items;

        return rawList.filter(item => {
        const matchFirst = !criteria.firstName || item.firstName?.toLowerCase().includes(criteria.firstName.toLowerCase());
        const matchLast = !criteria.lastName || item.lastName?.toLowerCase().includes(criteria.lastName.toLowerCase());
        const matchEmail = !criteria.email || item.email?.toLowerCase().includes(criteria.email.toLowerCase());
        const matchDept = !criteria.department || item.department?.toLowerCase().includes(criteria.department.toLowerCase());

        return matchFirst && matchLast && matchEmail && matchDept;
        });
    });

    selectedItem = signal<any | null>(
        this.data.selectedId 
        ? this.data.items.find(i => i[this.data.idKey] === this.data.selectedId) 
        : null
    );

    selectItem(item: any) {
        this.selectedItem.set(item);
    }

    onConfirm() {
        this.dialogRef.close(this.selectedItem());
    }

    onCancel() {
        this.dialogRef.close();
    }
}