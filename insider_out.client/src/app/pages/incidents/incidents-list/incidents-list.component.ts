import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, output, Output } from '@angular/core';
import { ProfileAvatarComponent } from '../../../fragments/profile-avatar/profile-avatar.component';
import { UserService } from '../../../services/user.service';
import { IncidentModel, IncidentViewModel } from '../../../models/incidents.model';
import { TokenType } from '../../../models/token.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { SubjectService } from '../../../services/subject.service';
import { MatIcon } from "@angular/material/icon";
import { status_colors, status_text } from "../../../fragments/pill/incident-status-constants";
import { BreakpointService } from '../../../services/breakpoint.service';
import { TokenService } from '../../../services/token.service';
import { PillComponent } from '../../../fragments/pill/pill.component';
import { UserStore } from '../../../stores/user.store';
import { SubjectStore } from '../../../stores/subject.store';
import { DocumentStore } from '../../../stores/documents.store';

@Component({
    selector: 'io-incidents-list',
    templateUrl: './incidents-list.component.html',
    styleUrl: './incidents-list.component.scss',
    standalone: true,
    imports: [CommonModule, ProfileAvatarComponent, MatIcon, PillComponent]
})
export class IncidentsListComponent {

protected userStore = inject(UserStore);
    protected subjectStore = inject(SubjectStore);
    protected documentStore = inject(DocumentStore);

    protected tokenType = TokenType;

    readonly incidents$ = input.required<IncidentModel[]>({alias: 'incidents'});
    readonly isLoading$ = input<boolean>(false, {alias: "isLoading"});
    
    readonly incidentSelected = output<IncidentModel>();


    statusColors = status_colors;
    statusText = status_text;

    constructor(public breakpointService: BreakpointService) { }

    onSelectIncident(incident: IncidentModel) {
        this.incidentSelected.emit(incident);
    }

    public incidentViewModels = computed<IncidentViewModel[]>(() => {
        const incidents = this.incidents$();
        
        const users = this.userStore.users();
        const subjects = this.subjectStore.subjects();
        const documents = this.documentStore.documents();

        if (!incidents || incidents.length === 0) {
            return [];
        }

        return incidents.map(incident => {
            const user = incident.assignedUserId 
                ? users.find(u => u.userId === incident.assignedUserId) || null 
                : null;

            const subject = incident.tiedSubjectId 
                ? subjects.find(s => s.subjectId === incident.tiedSubjectId) || null 
                : null;

            let token = null;
            if (incident.tokenId) {
                if (incident.tokenType === TokenType.document) {
                    token = documents.find(d => d.tokenId === incident.tokenId) || null;
                }
            }

            return {
                incident,
                subject,
                user,
                token
            };
        });
    });

}