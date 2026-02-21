import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { TokensDocumentsViewComponent } from "./tokens-documents-view/tokens-documents-view.component";
import { TokenService } from '../../../services/token.service';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterValue } from '../../../models/filter.model';
import { TokenModel } from '../../../models/token.model';
import { DocumentStore } from '../../../stores/documents.store';

@Component({
    selector: 'io-tokens-documents',
    templateUrl: './tokens-documents.component.html',
    standalone: true,
    imports: [TokensDocumentsViewComponent]
})
export class TokensDocumentsComponent {

    protected documentStore = inject(DocumentStore);
    protected userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private allDocumentTokens = this.documentStore.documents;

    protected currentUserFilter = signal<FilterValue>('all');
    protected currentTypeFilter = signal<FilterValue>('all');

    protected filteredDocuments$ = computed(() => {
        const documents = this.allDocumentTokens();
        // const userFilter = this.currentUserFilter();
        // const typeFilter = this.currentTypeFilter();
        
        let result = documents; 

        // switch (userFilter) {
        //     case 'mine':
        //         result = result.filter(i => i.assignedUserId === currentUser?.userId);
        //         break;
            
        //     case 'unassigned':
        //         result = result.filter(i => !i.assignedUserId);
        //         break;            
            
        //     case 'all':
        //     default:
        //         break;
        // }

        // switch (typeFilter) {
        //     case 'document':
        //         return result.filter(i => i.tokenType === TokenType.document);
            
        //     case 'email':
        //         return result.filter(i => i.tokenType === TokenType.email);
            
        //     case 'all':
        //     default:
        //         return result;
        // }
        return result;
    });

    onUserFilterChange(newFilter: FilterValue) {
        this.currentUserFilter.set(newFilter);
    }

    onTypeFilterChange(newFilter: FilterValue) {
        this.currentTypeFilter.set(newFilter);
    }

    onIncidentSelected(token: TokenModel) {
        const id = token.tokenId;

        this.router.navigate([id], { relativeTo: this.route });
    }


}
