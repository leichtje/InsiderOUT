import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { filter, of, startWith, switchMap } from 'rxjs';
import { IncidentService } from '../../../services/incident.service';
import { UserService } from '../../../services/user.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { IncidentModel, IncidentStatus } from '../../../models/incidents.model';
import { SubjectModel, UserModel } from '../../../models/profile.model';
import { SubjectService } from '../../../services/subject.service';
import { StatusComponent } from "../../../fragments/pill/incident-status.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionBarComponent } from "../../../fragments/header/action-bar/action-bar.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileAvatarComponent } from "../../../fragments/profile-avatar/profile-avatar.component";
import { ProfileSelectComponent } from "../../../fragments/header/profile-select/profile-select.component";
import { StatusSelectComponent } from "../../../fragments/incident-status-select/incident-status-select.component";
import { ProfilePickerComponent } from '../../../fragments/profile-picker/profile-picker.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TokenService } from '../../../services/token.service';
import { DocumentModel, EmailModel, Token, TokenModel, TokenType } from '../../../models/token.model';
import { tokenComponent } from "../../../fragments/pill/token-severity.component";
import { ActivityListComponent } from "../../../fragments/activity-list/activity-list.component";
import { ActivityScope } from '../../../models/activity.model';

@Component({
    selector: 'io-incidents-detail',
    templateUrl: './incidents-detail.component.html',
    styleUrl: './incidents-detail.component.scss',
    standalone: true,
    imports: [
    CommonModule,
    RouterLink,
    StatusComponent,
    ActionBarComponent,
    MatIconModule,
    ProfileAvatarComponent,
    ProfileSelectComponent,
    StatusSelectComponent,
    ProfilePickerComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TextFieldModule,
    tokenComponent,
    ActivityListComponent
]
})
export class IncidentsDetailComponent { //in the future make this a base to be extended. 

    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);

    protected incidentService = inject(IncidentService);
    protected userService = inject(UserService);
    protected subjectService = inject(SubjectService);
    protected tokenService = inject(TokenService);

    protected readonly tokenType = TokenType;
    protected readonly activityScope = ActivityScope;

    protected users = this.userService.users;
    protected subjects = this.subjectService.subjects;
    
    statusOptions = Object.values(IncidentStatus);

    form = this.fb.group({
        title: ['', Validators.required],
        desc: [''],
        status: [null as IncidentStatus | null, Validators.required],
        assignedUserId: [null as number | null],
        tiedSubjectId: [null as number | null],
        tokenId: [null as number | null]
    });

    constructor() {
        effect(() => {
        const data = this.incident();
        if (data) {
            this.form.patchValue({
                title: data.title,
                desc: data.desc,
                status: data.status,
                assignedUserId: data.assignedUserId,
                tiedSubjectId: data.tiedSubjectId,
                tokenId: data.tokenId
            });

            this.form.markAsPristine(); 
        }
        });
    }

    private assignedUserId$ = this.form.controls.assignedUserId.valueChanges.pipe(
        startWith(this.form.controls.assignedUserId.value) 
    );

    selectedUserId = toSignal(this.assignedUserId$);

    selectedUser = computed(() => {
        const id = this.selectedUserId();
        const users = this.users();
        return users.find(u => u.userId === id) || null;
    });

    private tiedSubjectId$ = this.form.controls.tiedSubjectId.valueChanges.pipe(
        startWith(this.form.controls.tiedSubjectId.value)
    );
    selectedSubjectId = toSignal(this.tiedSubjectId$);
    
    selectedSubject = computed(() => {
        const id = this.selectedSubjectId();
        return this.subjects().find(s => s.subjectId === id) || null;
    });

    canDeactivate(): boolean {
        if (this.form.dirty) {
            return confirm('You have unsaved changes. Do you really want to leave?');
        }
        return true;
    }

    onSave() {
        if (this.form.valid) {
            const formValue = this.form.value;
            console.log('Saving payload:', formValue);
            // TODO: Call service update method here

            this.form.markAsPristine();
        }
    }

    onCancel() {
        const data = this.incident();
        if (data) {
            this.form.reset(data);
        }
    }

    private incidentId$ = this.route.paramMap.pipe(
        switchMap(params => {
            const id = params.get('id');
            return of(id ? +id : null);
        })
    );

    incident = toSignal(
        this.incidentId$.pipe(
            filter((id): id is number => id !== null),
            switchMap(id => {
                return this.incidentService.getIncidentById(id);
            })
        ),
        { initialValue: null }
    );

    private incidentSignal$ = toObservable(this.incident);

    assignedUser = toSignal(
        this.incidentSignal$.pipe(
            filter((incident): incident is IncidentModel => !!incident),
            switchMap(incident => {
                const userId = incident.assignedUserId;
                if (userId) {
                    return this.userService.getUserById(userId);
                }
                return of(null as UserModel | null);
            })
        ),
        { initialValue: null as UserModel | null }
    );

    tiedSubject = toSignal(
        this.incidentSignal$.pipe(
            filter((incident): incident is IncidentModel => !!incident),
            switchMap(incident => {
                const subjectId = incident.tiedSubjectId;
                if (subjectId) {
                    return this.subjectService.getSubjectById(subjectId);
                }
                return of(null as SubjectModel | null);
            })
        ),
        { initialValue: null as SubjectModel | null }
    );

    token = toSignal(
        this.incidentSignal$.pipe(
            filter((incident): incident is IncidentModel => !!incident),
            switchMap(incident => {
                const tokenId = incident.tokenId;
                const tokenType = incident.tokenType;
                if (tokenId) {
                    return this.tokenService.getToken(tokenId, tokenType);
                }
                return of(null as Token | null); 
            })
        ),
        { initialValue: null as Token | null }
    );

    tokenAsDocument = computed(() => {
        const t = this.token();
        return (t?.type === TokenType.document) ? (t as DocumentModel) : null;
    });
    
    tokenAsEmail = computed(() => {
        const t = this.token();
        return (t?.type === TokenType.email) ? (t as EmailModel) : null;
    });

}