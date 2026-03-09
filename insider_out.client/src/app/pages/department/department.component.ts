import { Component, inject} from '@angular/core';
import { DepartmentViewComponent } from './department-view/department-view.component';
import { DepartmentStore } from '../../stores/department.store';
import { DepartmentModel } from '../../models/department.model';
import { DepartmentDialogComponent } from './department-add-dialog/department-add-dialog.component';
import { ResponsiveDialogService } from '../../services/responsive-dialog.service';


@Component({
    selector: 'io-department',
    templateUrl: './department.component.html',
    standalone: true,
    imports: [DepartmentViewComponent]
})
export class DepartmentComponent {
    readonly store = inject(DepartmentStore);
    private dialog = inject(ResponsiveDialogService);

    handleReorder(updatedDepartments: DepartmentModel[]) {    
    }

    handleUpdate(updatedDepartment: DepartmentModel) {
        this.store.update({ 
            id: updatedDepartment.departmentId, 
            data: updatedDepartment 
        });
    }

    openCreate() {
        this.dialog.open(DepartmentDialogComponent, {});
    }
}