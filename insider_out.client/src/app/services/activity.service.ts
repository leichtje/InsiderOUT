import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IncidentModel, IncidentStatus } from '../models/incidents.model';
import { TokenType } from '../models/token.model';
import { ActivityModel, ActivityScope } from '../models/activity.model';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {

    private activitiesSignal = signal<ActivityModel[]>([
        {
            activityId: 1,
            content: 'Created the incident ticket.',
            date: new Date('2025-11-20T09:00:00'),
            entityId: 1,
            entityType: ActivityScope.Incident,
            userId: 101
        },
        {
            activityId: 2,
            content: 'Changed status to In Progress.',
            date: new Date('2025-11-20T10:30:00'),
            entityId: 1,
            entityType: ActivityScope.Incident,
            userId: 102
        },
        {
            activityId: 3,
            content: 'Added a comment about the firewall logs.',
            date: new Date('2025-11-21T14:15:00'),
            entityId: 1,
            entityType: ActivityScope.Incident,
            userId: 101
        },
        {
            activityId: 4,
            content: 'Test activity.',
            date: new Date('2025-11-22T08:00:00'),
            entityId: 2,
            entityType: ActivityScope.Incident,
            userId: 102
        }
        
    ]);

    public activities = this.activitiesSignal.asReadonly();


}