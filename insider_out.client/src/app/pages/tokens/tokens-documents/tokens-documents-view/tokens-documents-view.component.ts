import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { FilterComponent } from '../../../../fragments/incidents-filter/filter.component';

@Component({
    selector: 'io-tokens-documents-view',
    templateUrl: './tokens-documents-view.component.html',
    styleUrl: './tokens-documents-view.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        FilterComponent,
        MatIcon
]
})
export class TokensDocumentsViewComponent {


}
