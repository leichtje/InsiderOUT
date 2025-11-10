import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { filter, of, Subject, switchMap } from 'rxjs';
import { IncidentService } from '../../../../../services/incident.service';
import { UserService } from '../../../../../services/user.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { IncidentsModel } from '../../../../../models/incidents.model';
import { SubjectModel, UserModel } from '../../../../../models/profile.model';
import { SubjectService } from '../../../../../services/subject.service';

@Component({
    selector: 'io-incidents-open-detail',
    templateUrl: './incidents-open-detail.component.html',
    styleUrl: './incidents-open-detail.component.scss',
    standalone: true,
    imports: [CommonModule, RouterLink]
})
export class IncidentsOpenDetailComponent {

    private route = inject(ActivatedRoute);
    protected incidentService = inject(IncidentService);
    protected userService = inject(UserService);
    protected subjectService = inject(SubjectService);

    protected activeId = signal<number | null>(null);

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
            filter((incident): incident is IncidentsModel => !!incident),
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
            filter((incident): incident is IncidentsModel => !!incident),
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


}