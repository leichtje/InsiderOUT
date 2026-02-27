
import { Component, effect, inject, signal } from "@angular/core";
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
import { IncidentsListComponent } from "../../../../fragments/dialog/dialog-header/dialog-header.component";
import { StepDefinition, StepProgressComponent } from "../../../../fragments/step-progress/step-progress.component";
import { SkeletonLoaderComponent } from "../../../../fragments/skeleton-loader/skeleton-loader.component";
import { GradientTextDirective } from "../../../../fragments/gradient-text/gradient-text.directive";

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
        IncidentsListComponent,
        StepProgressComponent,
        SkeletonLoaderComponent,
        GradientTextDirective
    ],
    templateUrl: './tokens-documents-dialog.component.html',
    styleUrl: './tokens-documents-dialog.component.scss'
})
export class TokensDocumentsDialogComponent {
    
    private dialogRef = inject(MatDialogRef<TokensDocumentsDialogComponent>);
    public data = inject<TokensDocumentsDialogData>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);

    documentForm = this.fb.group({
        description: ['', Validators.required],
        audience: ['', Validators.required],
        // department: ['', Validators.required],
        sensitivity: ['', Validators.required]
    });

    locationForm = this.fb.group({
        location: [''],
    });

    sensitivityColors = sensitivity_colors;
    sensitivityText = sensitivity_text;
    sensitivityOptions = Object.values(TokenSensitivity);

    currentStepIndex$ = signal(0);
    isLoading$ = signal(false);

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
        const requiredFields = ['description', 'audience', 'sensitivity'];
        
        let validCount = 0;

        requiredFields.forEach(key => {
        const control = this.documentForm.get(key);
        

        if (control && control.valid) {
            validCount++;
        }
        });

        return (validCount / requiredFields.length) * 100;
    }

    onPreview() {
        this.documentForm.markAllAsTouched();
        
        if (this.documentForm.valid) {
            this.currentStepIndex$.set(1); 
            this.isLoading$.set(true);
            
            setTimeout(() => {
                this.isLoading$.set(false); 
            }, 5000);
        }
    }

    onFinalize() {
        this.currentStepIndex$.set(2);
        this.isLoading$.set(true);

        //Need to save data to db at this point, because doc is final

        setTimeout(() => {
            this.isLoading$.set(false);
        }, 10000);
    }

    onDownload() {

    }

    onBack() {
        this.currentStepIndex$.set(0);
    }

    onCancel() {
        this.dialogRef.close();
    }

    onDone() {
        //Need to save location to db if there is one, maybe auto save could be nice too? 

        this.dialogRef.close(this.documentForm.value);
        
        //Navigate to doc
    }

}