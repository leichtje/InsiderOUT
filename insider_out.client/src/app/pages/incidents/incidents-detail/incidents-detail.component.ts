import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map, of, startWith, switchMap } from 'rxjs';
import { IncidentService } from '../../../services/incident.service';
import { UserService } from '../../../services/user.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { IncidentModel, IncidentStatus } from '../../../models/incidents.model';
import { SubjectModel, UserModel } from '../../../models/profile.model';
import { SubjectService } from '../../../services/subject.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionBarComponent } from "../../../fragments/header/action-bar/action-bar.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { PillSelectComponent } from "../../../fragments/pill-select/pill-select.component";
import { ProfilePickerComponent } from '../../../fragments/profile-picker/profile-picker.component';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TokenService } from '../../../services/token.service';
import { DocumentModel, EmailModel, Token, TokenType } from '../../../models/token.model';
import { sensitivity_colors, sensitivity_text } from "../../../fragments/pill/token-sensitivity-constants";
import { ActivityListComponent } from "../../../fragments/activity-list/activity-list.component";
import { ActivityScope } from '../../../models/activity.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointService } from "../../../services/breakpoint.service";
import { PillComponent } from "../../../fragments/pill/pill.component";
import { status_colors, status_text } from '../../../fragments/pill/incident-status-constants';
import { IncidentDetailStore } from '../../../stores/incident-detail.store';
import { UserStore } from '../../../stores/user.store';
import { SubjectStore } from '../../../stores/subject.store';
import { IncidentStore } from '../../../stores/incident.store';

@Component({
    selector: 'io-incidents-detail',
    templateUrl: './incidents-detail.component.html',
    styleUrl: './incidents-detail.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ActionBarComponent,
        MatIconModule,
        ProfilePickerComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        TextFieldModule,
        ActivityListComponent,
        PillComponent,
        PillSelectComponent
    ],
    providers: [IncidentDetailStore]
})
export class IncidentsDetailComponent implements OnInit { 

    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    protected breakpointService = inject(BreakpointService);

    public store = inject(IncidentDetailStore);
    protected userStore = inject(UserStore);
    protected subjectStore = inject(SubjectStore);
    protected incidentStore = inject(IncidentStore); 

    protected readonly activityScope = ActivityScope;

    protected users = this.userStore.users;
    protected subjects = this.subjectStore.subjects;

    statusColors = status_colors;
    statusText = status_text;
    statusOptions = Object.values(IncidentStatus);

    sensitivityColors = sensitivity_colors;
    sensitivityText = sensitivity_text;

    form = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(100)]],
        desc: [''],
        status: [null as IncidentStatus | null, Validators.required],
        assignedUserId: [null as number | null],
        tiedSubjectId: [null as number | null],
        tokenId: [null as number | null]
    });

    constructor() {
        effect(() => {
            const data = this.store.incident();
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

    ngOnInit() {
        this.route.paramMap.pipe(
            map(params => params.get('id')),
            filter((id): id is string => id !== null),
            map(id => +id)
        ).subscribe(id => {
            this.store.loadIncidentDetails(id);
        });
    }

    activeTab = signal<'left' | 'right'>('left');
    isPhone = computed(() => this.breakpointService.isPhone()); 
    
    selectTab(tab: 'left' | 'right') {
        this.activeTab.set(tab);
    }

    selectedUserId = toSignal(this.form.controls.assignedUserId.valueChanges, {
        initialValue: this.form.controls.assignedUserId.value
    });
    
    selectedUser = computed(() => {
        const id = this.selectedUserId();
        return this.users().find(u => u.userId === id) || null;
    });

    selectedSubjectId = toSignal(this.form.controls.tiedSubjectId.valueChanges, {
        initialValue: this.form.controls.tiedSubjectId.value
    });
    
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
            const incidentId = this.store.incident()?.incidentId;
            
            if (incidentId) {
                this.incidentStore.update({ id: incidentId, data: formValue as any });
            }

            this.form.markAsPristine();
        }
    }

    onCancel() {
        const data = this.store.incident();
        if (data) {
            this.form.reset(data);
        }
    }
}