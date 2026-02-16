import { Component} from '@angular/core';
import { CompanyViewComponent } from './company-view/company-view.component';

@Component({
    selector: 'io-company',
    templateUrl: './company.component.html',
    standalone: true,
    imports: [CompanyViewComponent]
})
export class CompanyComponent {
    

}