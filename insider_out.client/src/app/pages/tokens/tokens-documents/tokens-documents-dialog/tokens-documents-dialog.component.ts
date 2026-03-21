
import { Component, effect, ElementRef, inject, signal, ViewChild } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { sensitivity_colors, sensitivity_text } from "../../../../fragments/pill/token-sensitivity-constants";
import { TokenSensitivity } from "../../../../models/token.model";
import { PillSelectComponent } from "../../../../fragments/pill-select/pill-select.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { StepDefinition, StepProgressComponent } from "../../../../fragments/step-progress/step-progress.component";
import { SkeletonLoaderComponent } from "../../../../fragments/skeleton-loader/skeleton-loader.component";
import { GradientTextDirective } from "../../../../fragments/gradient-text/gradient-text.directive";
import { DialogHeader } from "../../../../fragments/dialog/dialog-header/dialog-header.component";
import { DepartmentStore } from "../../../../stores/department.store";
import { EntitySelectComponent } from "../../../../fragments/entity-select/entity-select.component";
import { DocumentStore } from "../../../../stores/documents.store";
import { PreviewDocumentsDialogComponent } from "../../../../fragments/preview-document/preview-document.component";

export interface TokensDocumentsDialogData {

}

@Component({
    selector: 'io-tokens-documents-dialog',
    standalone: true,
    imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    PillSelectComponent,
    MatTooltipModule,
    StepProgressComponent,
    SkeletonLoaderComponent,
    GradientTextDirective,
    DialogHeader,
    EntitySelectComponent,
    PreviewDocumentsDialogComponent
],
    templateUrl: './tokens-documents-dialog.component.html',
    styleUrl: './tokens-documents-dialog.component.scss'
})
export class TokensDocumentsDialogComponent {
    
    private dialogRef = inject(MatDialogRef<TokensDocumentsDialogComponent>);
    public data = inject<TokensDocumentsDialogData>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);
    public documentStore = inject(DocumentStore);
    public departmentStore = inject(DepartmentStore);

    @ViewChild('pdfIframe') pdfIframe!: ElementRef<HTMLIFrameElement>;

    documentForm = this.fb.group({
        description: ['', Validators.required],
        audience: ['', Validators.required],
        department: ['', Validators.required],
        sensitivity: ['', Validators.required]
    });

    locationForm = this.fb.group({
        location: [''],
    });

    readonly sensitivityColors = sensitivity_colors;
    readonly sensitivityText = sensitivity_text;
    readonly sensitivityOptions = Object.values(TokenSensitivity);

    currentStepIndex$ = signal(0);
    isLoading$ = this.documentStore.isLoading;

    get steps(): StepDefinition[] {
        const step = this.currentStepIndex$(); 
        const loading = this.isLoading$();
        const formProgress = this.calculateFormProgress();

        return [
            {
                label: 'Define',
                percentage: formProgress, 
                isActive: step === 0,
                isCompleted: step > 0 
            },
            {
                label: 'Preview',
                percentage: (step > 1) || (step === 1 && !loading) ? 100 : 0,
                isActive: step === 1,
                isCompleted: step > 1
            },
            {
                label: 'Finalize',
                percentage: (step === 2 && !loading) ? 100 : 0,
                isActive: step === 2,
                isCompleted: step > 2
            }
        ];
    }

    constructor() {
        effect(() => {
            const step = this.currentStepIndex$();
            this.dialogRef.disableClose = step > 0;
        });
    }

    calculateFormProgress(): number {
        const requiredFields = ['description', 'audience', 'department', 'sensitivity'];
        
        let validCount = 0;

        requiredFields.forEach(key => {
            const control = this.documentForm.get(key);
            

            if (control && control.valid) {
                validCount++;
            }
        });

        return (validCount / requiredFields.length) * 100;
    }


    // toggleFullscreen() {
    //     const elem = this.pdfIframe.nativeElement;

    //     if (elem.requestFullscreen) {
    //         elem.requestFullscreen();
    //     } else if ((elem as any).webkitRequestFullscreen) {
    //         (elem as any).webkitRequestFullscreen();
    //     } else if ((elem as any).msRequestFullscreen) {
    //         (elem as any).msRequestFullscreen();
    //     }
    // }

    onPreview() {
        if (this.documentForm.valid) {
            const formVals = this.documentForm.value

            const requestPayload = {
                shortDescription: formVals.description ?? '',
                targetAudience: formVals.audience ?? '',
                severityLevel: formVals.sensitivity ?? '',
                departments: [formVals.department ?? '']
            }

            this.documentStore.documentPreview(requestPayload);
            this.currentStepIndex$.set(1);
        }
    }

    onFinalize() {
        const previewData = this.documentStore.previewData();
        if (previewData) {
            this.documentStore.finalizePreview(previewData);
            this.currentStepIndex$.set(2);
        }
    }

    onDone() {
        if (this.locationForm.valid) {
            const previewData = this.documentStore.previewData();
            const formValues = this.documentForm.value;
            const locationValue = this.locationForm.value.location;

            const finalDocumentToSave = {
                created: new Date(), 
                name: formValues.description ?? '',
                department: formValues.department ?? '',
                location: locationValue ?? '',
                sensitivity: (formValues.sensitivity ?? TokenSensitivity.Low) as TokenSensitivity,
                content: previewData?.content ?? '',
                header: previewData?.header ?? '',
                fileName: previewData?.fileName ?? '',
            };

            this.documentStore.create(finalDocumentToSave);
            
            this.onCancel(); 
        }
    }

    onDownload() {

    }

    onBack() {
        this.currentStepIndex$.set(0);
    }

    onCancel() {
        this.dialogRef.close();
    }

}