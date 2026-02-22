import { Component, EventEmitter, inject, input, output, Output } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { DocumentModel, TokenModel } from '../../../../models/token.model';
import { ResponsiveDialogService } from '../../../../services/responsive-dialog.service';
import { TokensDocumentsDialogComponent, TokensDocumentsDialogData } from '../tokens-documents-dialog/tokens-documents-dialog.component';
import { TokensDocumentsListComponent } from "../tokens-documents-list/tokens-documents-list.component";

@Component({
    selector: 'io-tokens-documents-view',
    templateUrl: './tokens-documents-view.component.html',
    styleUrl: './tokens-documents-view.component.scss',
    standalone: true,
    imports: [
        MatIcon,
        TokensDocumentsListComponent
    ]
})
export class TokensDocumentsViewComponent {

    private dialog = inject(ResponsiveDialogService);

    readonly filteredDocuments$ = input.required<DocumentModel[]>({alias: 'filteredDocuments'});
    readonly isLoading$ = input<boolean>(false, {alias: "isLoading"});

    // readonly activeId$ = input<number | null>();
    
    // readonly selectedDocument$ = input<IncidentViewModel | null>();
    // filterUserChange = output<FilterValue>();
    // filterTypeChange = output<FilterValue>();

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

