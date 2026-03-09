import { Component, inject} from '@angular/core';
import { DepartmentViewComponent } from './department-view/department-view.component';
import { DepartmentStore } from '../../stores/department.store';
import { DepartmentModel } from '../../models/department.model';


@Component({
    selector: 'io-department',
    templateUrl: './department.component.html',
    standalone: true,
    imports: [DepartmentViewComponent]
})
export class DepartmentComponent {
    
    readonly store = inject(DepartmentStore);

    handleReorder(updatedDepartments: DepartmentModel[]) {    
    }
}