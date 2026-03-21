import { Component, EventEmitter, inject, input, output, Output } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { DocumentModel, TokenModel } from '../../../../models/token.model';
import { ResponsiveDialogService } from '../../../../services/responsive-dialog.service';
import { TokensDocumentsDialogComponent, TokensDocumentsDialogData } from '../tokens-documents-dialog/tokens-documents-dialog.component';
import { TokensDocumentsListComponent } from "../tokens-documents-list/tokens-documents-list.component";
import { EntitySelectComponent } from "../../../../fragments/entity-select/entity-select.component";
import { DepartmentStore } from '../../../../stores/department.store';

@Component({
    selector: 'io-tokens-documents-view',
    templateUrl: './tokens-documents-view.component.html',
    styleUrl: './tokens-documents-view.component.scss',
    standalone: true,
    imports: [
    MatIcon,
    TokensDocumentsListComponent,
    EntitySelectComponent
]
})
export class TokensDocumentsViewComponent {

    private dialog = inject(ResponsiveDialogService);
    public departmentStore = inject(DepartmentStore);

    readonly filteredDocuments$ = input.required<DocumentModel[]>({alias: 'filteredDocuments'});
    readonly isLoading$ = input<boolean>(false, {alias: "isLoading"});

    readonly searchQuery = input<string>(''); 

    readonly searchQueryChange = output<string>();
    readonly filterDepartmentChange = output<string>();
    readonly documentSelected = output<DocumentModel>();

    onDocumentClicked(document: DocumentModel) {
        this.documentSelected.emit(document);
    }

    openCreateDialog() {
        
        const dialogRef = this.dialog.open(TokensDocumentsDialogComponent, {
            data: {
            } as TokensDocumentsDialogData
        });
    }

}

