import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TokensDocumentsViewComponent } from "./tokens-documents-view/tokens-documents-view.component";

@Component({
    selector: 'io-tokens-documents',
    templateUrl: './tokens-documents.component.html',
    standalone: true,
    imports: [CommonModule, TokensDocumentsViewComponent]
})
export class TokensDocumentsComponent {

}
