import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IncidentsModel } from '../models/incidents.model';

@Injectable({
    providedIn: 'root'
})
export class IncidentService {

    private incidentsSignal = signal<IncidentsModel[]>([
        {
            incidentId: 1,
            title: 'Incident #1',
            assignedUserId: 101,
            tiedSubjectId: 700
        },
        {
            incidentId: 2,
            title: 'Incident #2',
            assignedUserId: 101,
            tiedSubjectId: 700
        },
    ]);

    public incidents = this.incidentsSignal.asReadonly();

    constructor() { }

    public getIncidentById(id: number): Observable<IncidentsModel | undefined> {
        const incidentList = this.incidentsSignal(); 
        
        const incident = incidentList.find(i => i.incidentId === id);
        
        return of(incident);
    }

}