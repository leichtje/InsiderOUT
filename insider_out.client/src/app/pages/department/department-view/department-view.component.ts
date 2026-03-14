import { Component, effect, inject, input, output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { DepartmentModel } from '../../../models/department.model';
import { NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionBarComponent } from "../../../fragments/header/action-bar/action-bar.component";
import { MatIcon } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'io-department-view',
    templateUrl: './department-view.component.html',
    styleUrl: './department-view.component.scss',
    standalone: true,
    imports: [CdkDropList, CdkDrag, NgClass, ActionBarComponent, ReactiveFormsModule, MatIcon, MatSlideToggleModule]
})
export class DepartmentViewComponent {
    private fb = inject(FormBuilder);

    readonly departments = input.required<DepartmentModel[]>();
    readonly selectedDepartment = input<DepartmentModel | null>(null);
    private titleService = inject(Title);

    readonly select = output<number>();
    readonly reorder = output<DepartmentModel[]>();
    readonly update = output<DepartmentModel>(); 
    readonly create = output<void>(); 

    form = this.fb.group({
        departmentId: [0],
        department: ['', Validators.required],
        sortOrder: [0],
        isActive: [true]
    });

    constructor() {
        this.titleService.setTitle(`Departments`);

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
        this.select.emit(id);
    }

    drop(event: CdkDragDrop<DepartmentModel[]>) {
        if (event.previousIndex === event.currentIndex) {
            return;
        }

        const currentList = [...this.departments()];
        moveItemInArray(currentList, event.previousIndex, event.currentIndex);
        
        currentList.forEach((dept, index) => {
            const newSortOrder = index + 1;
            
            if (dept.sortOrder !== newSortOrder) {
                const updatedDept: DepartmentModel = {
                    ...dept,
                    sortOrder: newSortOrder
                };
                
                this.update.emit(updatedDept);
            }
        });
    }

    onCreate() {
        this.create.emit(); 
    }

    onSave() {
        if (this.form.valid && this.form.dirty) {
        this.update.emit(this.form.value as DepartmentModel);
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