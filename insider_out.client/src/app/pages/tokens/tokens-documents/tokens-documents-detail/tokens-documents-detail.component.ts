import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreakpointService } from '../../../../services/breakpoint.service';
import { DocumentDetailStore } from '../../../../stores/document-detail.store';
import { DocumentModel, TokenSensitivity } from '../../../../models/token.model';
import { sensitivity_colors, sensitivity_text } from '../../../../fragments/pill/token-sensitivity-constants';
import { filter, map } from 'rxjs';
import { DocumentStore } from '../../../../stores/documents.store';
import { ActionBarComponent } from "../../../../fragments/header/action-bar/action-bar.component";
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PillComponent } from '../../../../fragments/pill/pill.component';
import { SkeletonLoaderComponent } from '../../../../fragments/skeleton-loader/skeleton-loader.component';

@Component({
    selector: 'io-tokens-documents-detail',
    templateUrl: './tokens-documents-detail.component.html',
    styleUrl: './tokens-documents-detail.component.scss',
    standalone: true,
    imports: [
    CommonModule,
    RouterLink,
    ActionBarComponent,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    TextFieldModule,
    SkeletonLoaderComponent,
    PillComponent
],
    providers: [DocumentDetailStore]

})
export class TokensDocumentsDetailComponent {

    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    protected breakpointService = inject(BreakpointService);

    public store = inject(DocumentDetailStore);
    protected documentStore = inject(DocumentStore); 
    
    sensitivityColors = sensitivity_colors;
    sensitivityText = sensitivity_text;
    sensitivityOptions = Object.values(TokenSensitivity);

    form = this.fb.group({
        location: ['', [Validators.required, Validators.maxLength(100)]],
        sensitivity: [null as TokenSensitivity | null, Validators.required],
    });

    constructor() {
        effect(() => {
            const data = this.store.document();
            if (data) {
                this.form.patchValue({
                    location: data.location,
                    sensitivity: data.sensitivity,
                });

                console.log(data.sensitivity);
                
                this.form.markAsPristine(); 
            }
        });
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            map(params => params.get('id')),
            filter((id): id is string => id !== null),
            map(id => +id)
        ).subscribe(id => {
            this.store.loadDocumentDetails(id);
        });
    }

    activeTab = signal<'left' | 'right'>('left');
    isPhone = computed(() => this.breakpointService.isPhone()); 
    
    selectTab(tab: 'left' | 'right') {
        this.activeTab.set(tab);
    }

    canDeactivate(): boolean {
        if (this.form.dirty) {
            return confirm('You have unsaved changes. Do you really want to leave?');
        }
        return true;
    }

    onSave() {
        if (this.form.valid) {
            const currentDocument = this.store.document();
            
            if (currentDocument) {
                const updatedDocument: DocumentModel = {
                    ...currentDocument,
                    ...(this.form.value as Partial<DocumentModel>),
                    updated: new Date()
                };

                this.documentStore.update({ 
                    id: currentDocument.documentId, 
                    data: updatedDocument 
                });

                this.form.markAsPristine();
            }
        }
    }

    onCancel() {
        const data = this.store.document();
        if (data) {
            this.form.reset(data);
        }
    }

}
