import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
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

@Component({
    selector: 'io-incidents-list',
    templateUrl: './incidents-list.component.html',
    styleUrl: './incidents-list.component.scss',
    standalone: true,
    imports: [CommonModule, ProfileAvatarComponent, MatIcon, PillComponent]
})
export class IncidentsListComponent {

    protected userService = inject(UserService);
    protected subjectService = inject(SubjectService);
    protected tokenService = inject(TokenService);
    protected tokenType = TokenType;

    readonly incidents$ = input.required<IncidentModel[]>({alias: 'incidents'});

    statusColors = status_colors;
    statusText = status_text;

    @Output() incidentSelected = new EventEmitter<IncidentModel>();

    constructor(public breakpointService: BreakpointService) { }

    onSelectIncident(incident: IncidentModel) {
        this.incidentSelected.emit(incident);
    }

    private incidents = toObservable(this.incidents$);

    public incidentViewModels = toSignal(
        this.incidents.pipe(
            switchMap(incidents => {
                if (!incidents || incidents.length === 0) {
                    return of([]);
                }

                const lookups$ = incidents.map(incident => {
                    
                    const subject$ = incident.tiedSubjectId
                        ? this.subjectService
                            .getSubjectById(incident.tiedSubjectId)
                            .pipe(catchError(() => of(null)))
                        : of(null);

                    const user$ = incident.assignedUserId
                        ? this.userService
                            .getUserById(incident.assignedUserId)
                            .pipe(catchError(() => of(null)))
                        : of(null);

                    const token$ = incident.tokenId
                        ? this.tokenService
                            .getToken(incident.tokenId, incident.tokenType)
                            .pipe(catchError(() => of(null)))
                        : of(null);

                    return forkJoin({
                        subject: subject$,
                        user: user$,
                        token: token$
                    }).pipe(
                        map(({ subject, user, token }) => ({
                            incident: incident,
                            subject: subject,
                            user: user,
                            token: token
                        }) as IncidentViewModel)
                    );
                });

                return forkJoin(lookups$);
            })
        ),
        { initialValue: [] }
    );

}