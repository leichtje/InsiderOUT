import { Component, computed, inject, signal } from '@angular/core';
import { TokensDocumentsViewComponent } from "./tokens-documents-view/tokens-documents-view.component";
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentModel } from '../../../models/token.model';
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
    protected currentDepartmentFilter = signal<string>('');

    readonly searchQuery = signal<string>('');

    protected filteredDocuments$ = computed(() => {
        const documents = this.allDocumentTokens();
        const departmentFilter = this.currentDepartmentFilter();
        const searchQuery = this.searchQuery();

        let result = documents; 

        if (departmentFilter !== '') {
            result = result.filter(i => i.department === departmentFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(r => 
                (r.name || '').toLowerCase().includes(query) ||
                (r.fileName || '').toLowerCase().includes(query) ||
                (r.header || '').toLowerCase().includes(query) ||
                (r.location || '').toLowerCase().includes(query)
            );
        }

        return result;
    });

    onDepartmentFilterChange (newFilter: string) {
        this.currentDepartmentFilter.set(newFilter);
    }

    onDocumentSelected(document: DocumentModel) {
        const id = document.documentId;

        this.router.navigate([id], { relativeTo: this.route });
    }

    onSearch(searchQuery: string) {
        this.searchQuery.set(searchQuery);
    }
}
