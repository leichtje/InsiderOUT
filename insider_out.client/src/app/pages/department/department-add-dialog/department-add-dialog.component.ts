import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentStore } from '../../../stores/department.store';
import { MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { DialogHeader } from "../../../fragments/dialog/dialog-header/dialog-header.component";

@Component({
    selector: 'io-department-dialog',
    standalone: true,
    imports: [ReactiveFormsModule, MatDialogContent, MatDialogActions, DialogHeader],
    templateUrl: './department-add-dialog.component.html',
    styleUrl: './department-add-dialog.component.scss'
})
export class DepartmentDialogComponent {
    private dialogRef = inject(MatDialogRef<DepartmentDialogComponent>);
    private fb = inject(FormBuilder);
    
    private departmentStore = inject(DepartmentStore);

    form = this.fb.group({
        department: ['', Validators.required],
        isActive: [true],
        sortOrder: [0]
    });

    closeDialog() {
        this.dialogRef.close();
    }

    save() {
        if (this.form.invalid) return;

        const currentCount = this.departmentStore.departmentCount();

        const newDepartment = {
            department: this.form.value.department!,
            isActive: this.form.value.isActive ?? true,
            sortOrder: currentCount + 1 
        };

        this.departmentStore.create(newDepartment);
        
        this.closeDialog();
    }
}