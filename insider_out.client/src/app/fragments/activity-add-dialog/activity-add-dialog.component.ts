import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DialogHeader } from '../dialog/dialog-header/dialog-header.component';

export interface ActivityAddDialogData {
    entityId: number;
    entityType: string;
}

@Component({
    selector: 'io-activity-add-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TextFieldModule,
        DialogHeader
    ],
    templateUrl: './activity-add-dialog.component.html',
    styleUrl: './activity-add-dialog.component.scss',
})
export class ActivityAddDialogComponent {
    private dialogRef = inject(MatDialogRef<ActivityAddDialogComponent>);
    public data = inject<ActivityAddDialogData>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);

    form = this.fb.group({
        content: ['', [Validators.required, Validators.maxLength(500)]]
    });

    save() {
        if (this.form.valid) {
            this.dialogRef.close({
                content: this.form.value.content,
                entityId: this.data.entityId,
                entityType: this.data.entityType
            });
        }
    }

    closeDialog() {
        this.dialogRef.close()
    }
}