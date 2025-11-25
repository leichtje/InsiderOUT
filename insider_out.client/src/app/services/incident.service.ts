import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IncidentModel, IncidentStatus } from '../models/incidents.model';
import { TokenType } from '../models/token.model';

@Injectable({
    providedIn: 'root'
})
export class IncidentService {

    private incidentsSignal = signal<IncidentModel[]>([
        {
            incidentId: 1,
            title: 'Incident #1',
            date: new Date("2025-11-18T05:34:00Z"),
            updated: new Date("2025-11-24T09:12:00Z"),
            token: {
                type: TokenType.document,
                documentId: 123,
                name: 'MFA Password Enrollment',
                location: 'Server A'
            },
            status: IncidentStatus.New,
            assignedUserId: 101,
            tiedSubjectId: 700,
            tiedSubjectAgent: "Microsoft Office/16.0 (Windows NT 10.0; Microsoft Word 16.0.17126)"
        },
        {
            incidentId: 2,
            title: 'Incident #2',
            date: new Date("2025-11-08T04:39:00Z"),
            updated: new Date("2025-11-24T09:12:00Z"),
            token: {
                type: TokenType.document,
                documentId: 132,
                name: 'Secret Business Plans',
                location: 'Server A'
            },
            status: IncidentStatus.New,
            assignedUserId: 101,
            tiedSubjectId: 701,
            tiedSubjectAgent: "Microsoft-WebDAV-MiniRedir/6.1.7601"
        },
        {
            incidentId: 3,
            title: 'Incident #3',
            date: new Date("2025-11-16T15:58:00Z"),
            updated: new Date("2025-11-24T09:12:00Z"),
            token: {
                type: TokenType.document,
                documentId: 123,
                name: 'Payroll Incentives 2026',
                location: 'Server B'
            },
            status: IncidentStatus.inProgress,
            assignedUserId: 102,
            tiedSubjectId: 702,
            tiedSubjectAgent: "Microsoft Office/16.0 (Windows NT 6.1; Microsoft Word 16.0.17126; ProPlus)"
        },
        {
            incidentId: 4,
            title: 'Incident #4',
            date: new Date("2025-11-17T21:05:00Z"),
            updated: new Date("2025-11-24T09:12:00Z"),
            token: {
                type: TokenType.document,
                documentId: 154,
                name: 'Budget 2026 - CFO',
                location: 'Server C'
            },
            status: IncidentStatus.inProgress,
            assignedUserId: null,
            tiedSubjectId: null,
            tiedSubjectAgent: "Microsoft-WebDAV-MiniRedir/10.0.22621"
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