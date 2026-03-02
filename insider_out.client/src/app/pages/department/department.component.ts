import { Component} from '@angular/core';
import { DepartmentViewComponent } from './department-view/department-view.component';

@Component({
    selector: 'io-department',
    templateUrl: './department.component.html',
    standalone: true,
    imports: [DepartmentViewComponent]
})
export class DepartmentComponent {
    

}