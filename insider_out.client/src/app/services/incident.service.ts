import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IncidentModel } from '../models/incidents.model';
import { TokenType } from '../models/token.model';

@Injectable({
    providedIn: 'root'
})
export class IncidentService {

    private incidentsSignal = signal<IncidentModel[]>([
        {
            incidentId: 1,
            title: 'Incident #1',
            date: new Date("2025-11-24T09:12:00Z"),
            token: {
                type: TokenType.document,
                documentId: 123,
                name: 'MFA Password Enrollment',
                location: 'Server A'
            },
            assignedUserId: 101,
            tiedSubjectId: 700,
            tiedSubjectAgent: "Microsoft Office/16.0 (Windows NT 10.0; Microsoft Word 16.0.17126)"
        },
        {
            incidentId: 2,
            title: 'Incident #2',
            date: new Date("2025-11-16T15:58:00Z"),
            token: {
                type: TokenType.document,
                documentId: 123,
                name: 'Payroll Incentives 2026',
                location: 'Server B'
            },
            assignedUserId: 101,
            tiedSubjectId: 700,
            tiedSubjectAgent: "Microsoft Office/16.0 (Windows NT 6.1; Microsoft Word 16.0.17126; ProPlus)"
        },
    ]);

    public incidents = this.incidentsSignal.asReadonly();

    constructor() { }

    public getIncidentById(id: number): Observable<IncidentModel | undefined> {
        const incidentList = this.incidentsSignal(); 
        
        const incident = incidentList.find(i => i.incidentId === id);
        
        return of(incident);
    }

}