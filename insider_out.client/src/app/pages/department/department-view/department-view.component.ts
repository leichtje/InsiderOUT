import { Component, effect, inject, input, output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { DepartmentModel } from '../../../models/department.model';
import { NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionBarComponent } from "../../../fragments/header/action-bar/action-bar.component";

@Component({
    selector: 'io-department-view',
    templateUrl: './department-view.component.html',
    styleUrl: './department-view.component.scss',
    standalone: true,
    imports: [CdkDropList, CdkDrag, NgClass, ActionBarComponent, ReactiveFormsModule]
})
export class DepartmentViewComponent {
    private fb = inject(FormBuilder);

    departments = input.required<DepartmentModel[]>();
    selectedDepartment = input<DepartmentModel | null>(null);

    onSelect = output<number>();
    onReorder = output<DepartmentModel[]>();
    onUpdate = output<DepartmentModel>(); 

    form = this.fb.group({
        departmentId: [0],
        department: ['', Validators.required],
        sortOrder: [0],
        isActive: [false]
    });

    constructor() {
        effect(() => {
            const dept = this.selectedDepartment();
            if (dept) {
                this.form.patchValue(dept, { emitEvent: false });
                this.form.markAsPristine(); 
            } else {
                this.form.reset();
            }
        });
    }

    selectDepartment(id: number) {
        if (this.form.dirty && !confirm('You have unsaved changes. Discard?')) {
        return;
        }
        this.onSelect.emit(id);
    }

    drop(event: CdkDragDrop<DepartmentModel[]>) {
        const currentList = [...this.departments()];
        moveItemInArray(currentList, event.previousIndex, event.currentIndex);
        
        const updatedList = currentList.map((dept, index) => ({
        ...dept,
        sortOrder: index + 1 
        }));

        this.onReorder.emit(updatedList);
    }

    onSave() {
        if (this.form.valid && this.form.dirty) {
        this.onUpdate.emit(this.form.value as DepartmentModel);
        this.form.markAsPristine();
        }
    }

    onCancel() {
        const dept = this.selectedDepartment();
        if (dept) {
        this.form.patchValue(dept);
        this.form.markAsPristine();
        }
    }

}