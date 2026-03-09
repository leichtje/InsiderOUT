import { Component, input, output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { DepartmentModel } from '../../../models/department.model';
import { NgClass } from '@angular/common';

@Component({
    selector: 'io-department-view',
    templateUrl: './department-view.component.html',
    styleUrl: './department-view.component.scss',
    standalone: true,
    imports: [CdkDropList, CdkDrag, NgClass]
})
export class DepartmentViewComponent {
    departments = input.required<DepartmentModel[]>();
    selectedDepartment = input<DepartmentModel | null>(null);

    onSelect = output<number>();
    onReorder = output<DepartmentModel[]>();

    drop(event: CdkDragDrop<DepartmentModel[]>) {
        const currentList = [...this.departments()];
        
        moveItemInArray(currentList, event.previousIndex, event.currentIndex);
        
        const updatedList = currentList.map((dept, index) => ({
        ...dept,
        sortOrder: index + 1
        }));

        this.onReorder.emit(updatedList);
    }

}