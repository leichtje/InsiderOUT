import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';

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
        TextFieldModule
    ],
    templateUrl: 'activity-add-dialog.component.ts',
    styleUrl: 'activity-add-dialog.component.scss'
})
export class ActivityAddDialogComponent {
    private dialogRef = inject(MatDialogRef<ActivityAddDialogComponent>);
    public data = inject<ActivityAddDialogData>(MAT_DIALOG_DATA);
    private fb = inject(FormBuilder);

    form = this.fb.group({
        content: ['', [Validators.required, Validators.maxLength(500)]]
    });

    onSubmit() {
        if (this.form.valid) {
            this.dialogRef.close({
                content: this.form.value.content,
                entityId: this.data.entityId,
                entityType: this.data.entityType
            });
        }
    }
}