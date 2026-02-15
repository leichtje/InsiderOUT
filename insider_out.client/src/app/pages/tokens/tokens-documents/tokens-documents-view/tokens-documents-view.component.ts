
import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { FilterComponent } from '../../../../fragments/incidents-filter/filter.component';
import { MatDialog } from '@angular/material/dialog';
import { TokensDocumentsDialogComponent, TokensDocumentsDialogData } from '../tokens-documents-dialog/tokens-documents-dialog.component';
import { ResponsiveDialogService } from '../../../../services/responsive-dialog.service';

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

    openCreateDialog() {
        
        const dialogRef = this.dialog.open(TokensDocumentsDialogComponent, {
            data: {
            } as TokensDocumentsDialogData
        });
    }


}
