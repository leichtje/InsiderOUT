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
            title: 'testing',
            assignedUserId: 101
        },
        {
            incidentId: 2,
            title: 'test',
            assignedUserId: 101
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