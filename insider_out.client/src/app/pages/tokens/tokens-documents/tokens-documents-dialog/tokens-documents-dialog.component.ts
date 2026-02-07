import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { ProfilePickerDialogComponent } from "../../../../fragments/profile-picker-dialog/profile-picker-dialog.component";
import { sensitivity_colors, sensitivity_text } from "../../../../fragments/pill/token-sensitivity-constants";
import { TokenSensitivity } from "../../../../models/token.model";
import { PillSelectComponent } from "../../../../fragments/pill-select/pill-select.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { IncidentsListComponent } from "../../../../fragments/dialog/dialog-header/dialog-header.component";

export interface TokensDocumentsDialogData {

}

@Component({
    selector: 'io-tokens-documents-dialog',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    PillSelectComponent,
    MatTooltipModule,
    IncidentsListComponent
],
    templateUrl: './tokens-documents-dialog.component.html',
    styleUrl: './tokens-documents-dialog.component.scss'
})
export class TokensDocumentsDialogComponent {
    
    private dialogRef = inject(MatDialogRef<ProfilePickerDialogComponent>);
    public data = inject<TokensDocumentsDialogData>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);

    documentForm = this.fb.group({
        description: ['', Validators.required],
        audience: ['', Validators.required],
        sensitivity: ['', Validators.required]
    });

    sensitivityColors = sensitivity_colors;
    sensitivityText = sensitivity_text;
    sensitivityOptions = Object.values(TokenSensitivity);

    onCancel() {
        this.dialogRef.close();
    }

    onConfirm() {
        this.documentForm.markAllAsTouched();

        if(this.documentForm.valid) {
            this.dialogRef.close();
        }
    }

}