import { Component, ElementRef, inject, input, output, viewChild, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { UserStore } from '../../../stores/user.store';
import { SubjectStore } from '../../../stores/subject.store';
import { SubjectModel, UserModel } from '../../../models/profile.model';

@Component({
    selector: 'io-profile-dialog',
    standalone: true,
    imports: [ReactiveFormsModule, TitleCasePipe],
    templateUrl: './profiles-dialog.component.html',
    styleUrl: './profiles-dialog.component.scss'
})
export class ProfileDialogComponent {
    private fb = inject(FormBuilder);
    private userStore = inject(UserStore);
    private subjectStore = inject(SubjectStore);

    dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

    type = input.required<'user' | 'subject'>();
    profileToEdit = input<UserModel | SubjectModel | null>(null);

    close = output<void>();

    form = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        department: [''],
        role: [''],
        riskScore: [0]
    });

    constructor() {
        effect(() => {
            const profile = this.profileToEdit();
            const type = this.type();

            this.form.reset();

            if (type === 'user') {
                this.form.controls.role.disable();
                this.form.controls.riskScore.disable();
                } else {
                this.form.controls.role.enable();
                this.form.controls.riskScore.enable();
            }

            if (profile) {
                this.form.patchValue({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    phone: profile.phone,
                    department: profile.department,
                    role: 'role' in profile ? profile.role : '',
                    riskScore: 'riskScore' in profile ? profile.riskScore : 0
                });
            }
        });
    }

    open() {
        this.dialogRef().nativeElement.showModal();
    }

    closeDialog() {
        this.dialogRef().nativeElement.close();
        this.close.emit();
    }

    save() {
        if (this.form.invalid) return;

        const val = this.form.value;
        const isEdit = !!this.profileToEdit();
        const currentProfile = this.profileToEdit();

        if (this.type() === 'user') {
            const userData: any = {
                firstName: val.firstName!,
                lastName: val.lastName!,
                email: val.email!,
                phone: val.phone || undefined,
                department: val.department || undefined,
                userId: isEdit ? (currentProfile as UserModel).userId : 0 
            };

            if (isEdit) {
                this.userStore.update({ id: userData.userId, data: userData });
            } else {
                const { userId, ...createData } = userData; 
                this.userStore.create(createData);
            }
        } 

        else {
            const subjectData: any = {
                firstName: val.firstName!,
                lastName: val.lastName!,
                email: val.email!,
                phone: val.phone || undefined,
                department: val.department || undefined,
                role: val.role || 'Standard',
                riskScore: val.riskScore || 0,
                subjectId: isEdit ? (currentProfile as SubjectModel).subjectId : 0
            };

            if (isEdit) {
                this.subjectStore.update({ id: subjectData.subjectId, data: subjectData });
                } else {
                const { subjectId, ...createData } = subjectData;
                this.subjectStore.create(createData);
            }
        }

        this.closeDialog();
    }
}