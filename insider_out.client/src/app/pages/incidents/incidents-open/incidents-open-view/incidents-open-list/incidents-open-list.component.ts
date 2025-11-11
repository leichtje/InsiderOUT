import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { ProfileAvatarComponent } from '../../../../../fragments/profile-avatar/profile-avatar.component';
import { UserService } from '../../../../../services/user.service';
import { IncidentModel, IncidentViewModel } from '../../../../../models/incidents.model';
import { TokenType } from '../../../../../models/token.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, Subject, switchMap } from 'rxjs';
import { SubjectService } from '../../../../../services/subject.service';
import { MatIcon } from "@angular/material/icon";
import { StatusComponent } from "../../../../../fragments/incident-status/incident-status.component";

@Component({
    selector: 'io-incidents-open-list',
    templateUrl: './incidents-open-list.component.html',
    styleUrl: './incidents-open-list.component.scss',
    standalone: true,
    imports: [CommonModule, ProfileAvatarComponent, MatIcon, StatusComponent]
})
export class IncidentsOpenListComponent {

    protected userService = inject(UserService);
    protected subjectService = inject(SubjectService);
    protected tokenType = TokenType;

    incidents = input<IncidentModel[]>();

    @Output() incidentSelected = new EventEmitter<IncidentModel>();

    onSelectIncident(incident: IncidentModel) {
        this.incidentSelected.emit(incident);
    }

    private incidents$ = toObservable(this.incidents);

    public incidentViewModels = toSignal(
        this.incidents$.pipe(
        switchMap(incidents => {
            if (!incidents || incidents.length === 0) {
            return of([]);
            }

            const lookups$ = incidents.map(incident => {
            
            const subject$ = this.subjectService
                .getSubjectById(incident.tiedSubjectId)
                .pipe(catchError(() => of(null)));

            const user$ = this.userService
                .getUserById(incident.assignedUserId)
                .pipe(catchError(() => of(null)));

            return forkJoin({
                subject: subject$,
                user: user$
            }).pipe(
                map(({ subject, user }) => ({
                incident: incident,
                subject: subject,
                user: user
                }) as IncidentViewModel)
            );
            });
            return forkJoin(lookups$);
        })
        ),
        { initialValue: [] }
    );

}