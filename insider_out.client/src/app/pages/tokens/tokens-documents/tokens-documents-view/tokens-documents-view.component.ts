import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { TokenModel } from '../../../../models/token.model';
import { ResponsiveDialogService } from '../../../../services/responsive-dialog.service';
import { TokensDocumentsDialogComponent, TokensDocumentsDialogData } from '../tokens-documents-dialog/tokens-documents-dialog.component';

@Component({
    selector: 'io-tokens-documents-view',
    templateUrl: './tokens-documents-view.component.html',
    styleUrl: './tokens-documents-view.component.scss',
    standalone: true,
    imports: [
        MatIcon
    ]
})
export class TokensDocumentsViewComponent {

    private dialog = inject(ResponsiveDialogService);

    readonly filteredDocuments$ = input.required<TokenModel[]>({alias: 'filteredDocuments'});
    // readonly activeId$ = input<number | null>();
    
    // readonly selectedDocument$ = input<IncidentViewModel | null>();
    // filterUserChange = output<FilterValue>();
    // filterTypeChange = output<FilterValue>();

    @Output() incidentSelected = new EventEmitter<TokenModel>();

    onIncidentClicked(incident: TokenModel) {
        this.incidentSelected.emit(incident);
    }

    

    openCreateDialog() {
        
        const dialogRef = this.dialog.open(TokensDocumentsDialogComponent, {
            data: {
            } as TokensDocumentsDialogData
        });
    }

}

