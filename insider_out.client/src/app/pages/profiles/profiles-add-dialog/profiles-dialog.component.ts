import { Component, inject, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserStore } from '../../../stores/user.store';
import { UserModel, SubjectModel } from '../../../models/profile.model';
import { SubjectStore } from '../../../stores/subject.store';
import { ResponsiveDialogService } from '../../../services/responsive-dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { IncidentsListComponent } from "../../../fragments/dialog/dialog-header/dialog-header.component";

export interface ProfileDialogData {
    type: 'user' | 'subject',
    profile: UserModel | SubjectModel | null
}

@Component({
    selector: 'io-profiles-dialog',
    standalone: true,
    imports: [ReactiveFormsModule, MatDialogContent, IncidentsListComponent, MatDialogActions],
    templateUrl: './profiles-dialog.component.html',
    styleUrl: './profiles-dialog.component.scss'
})
export class ProfileDialogComponent {
    private dialogRef = inject(MatDialogRef<ProfileDialogComponent>);
    public data = inject<ProfileDialogData>(MAT_DIALOG_DATA);
    
    private fb = inject(FormBuilder);
    private userStore = inject(UserStore);
    private subjectStore = inject(SubjectStore);


    type: 'user' | 'subject' = 'user'; 
    profileToEdit: UserModel | SubjectModel | null = null;

    form = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        department: [''],
        role: [''],
        riskScore: [0]
    });

    ngOnInit() {
        this.type = this.data.type;
        this.profileToEdit = this.data.profile;
        
        this.setupForm();
    }

    setupForm() {
        if (this.type === 'user') {
            this.form.controls.role.disable();
        }

        if (this.profileToEdit) {
            this.form.patchValue({
                firstName: this.profileToEdit.firstName,
                lastName: this.profileToEdit.lastName,
                email: this.profileToEdit.email,
                phone: this.profileToEdit.phone,
                department: this.profileToEdit.department,
                role: 'role' in this.profileToEdit ? this.profileToEdit.role : '',
            });
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }

    save() {
        if (this.form.invalid) return;

        const val = this.form.value;
        const isEdit = !!this.profileToEdit;

        if (this.type === 'user') {
                const userData: any = {
                firstName: val.firstName!,
                lastName: val.lastName!,
                email: val.email!,
                phone: val.phone || undefined,
                department: val.department || undefined,
                userId: isEdit ? (this.profileToEdit as UserModel).userId : 0 
            };

            if (isEdit) this.userStore.update({ id: userData.userId, data: userData });
            else this.userStore.create(userData);
        } 
        else {
            const subjectData: any = {
                firstName: val.firstName!,
                lastName: val.lastName!,
                email: val.email!,
                phone: val.phone || undefined,
                department: val.department || undefined,
                role: val.role || 'Standard',
                subjectId: isEdit ? (this.profileToEdit as SubjectModel).subjectId : 0
            };

            if (isEdit) this.subjectStore.update({ id: subjectData.subjectId, data: subjectData });
            else this.subjectStore.create(subjectData);
        }

        this.closeDialog();
    }
}