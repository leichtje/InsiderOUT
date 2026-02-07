import { Component, inject, computed, signal, effect, ViewChildren, ElementRef, QueryList } from '@angular/core';
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
import { IncidentsListComponent } from "../dialog/dialog-header/dialog-header.component";

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
    ProfileCardComponent,
    IncidentsListComponent
],
    templateUrl: './profile-picker-dialog.component.html',
    styleUrl: './profile-picker-dialog.component.scss'
})
export class ProfilePickerDialogComponent {
    
    private dialogRef = inject(MatDialogRef<ProfilePickerDialogComponent>);
    public data = inject<ProfilePickerData>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);

    @ViewChildren('listItemItem') listItems!: QueryList<ElementRef>;

    filterForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        email: [''],
        department: ['']
    });

    constructor() {
        effect(() => {
            const list = this.filteredItems();
            const current = this.selectedItem();
            const filters = this.filters();

            const isSearching = Object.values(filters).some(val => !!val && val.toString().trim() !== '');

            if (current && !list.includes(current)) {
                if (isSearching && list.length > 0) {
                    this.selectedItem.set(list[0]);
                } else {
                    this.selectedItem.set(null);
                }
            }

            if (isSearching && !current && list.length > 0) {
                this.selectedItem.set(list[0]);
            }
            
        }, { allowSignalWrites: true });
    }

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

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            event.stopPropagation();
            
            if (this.selectedItem()) {
                this.onConfirm();
            }
            return;
        }

        const list = this.filteredItems();
        if (list.length === 0) return;

        const current = this.selectedItem();
        const currentIndex = list.indexOf(current);

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextIndex = currentIndex < list.length - 1 ? currentIndex + 1 : 0;
            this.selectItem(list[nextIndex]);
            this.scrollToItem(nextIndex);
        
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : list.length - 1;
            this.selectItem(list[prevIndex]);
            this.scrollToItem(prevIndex);
        }
    }

    scrollToItem(index: number) {
        setTimeout(() => {
            const item = this.listItems.get(index);
            item?.nativeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
    }
}