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
            isActive: true,
            title: 'Incident #1',
            desc: "This is the description.",
            date: new Date("2025-11-18T05:34:00Z"),
            updated: new Date("2025-11-24T09:12:00Z"),
            agent: "Microsoft Office/16.0 (Windows NT 10.0; Microsoft Word 16.0.17126)",
            tokenId: 123,
            tokenType: TokenType.document,
            status: IncidentStatus.inProgress,
            assignedUserId: 101,
            tiedSubjectId: 700,
        },
        {
            incidentId: 2,
            isActive: true,
            title: 'Incident #2',
            desc: "This is an incident for sure.",
            date: new Date("2025-11-08T04:39:00Z"),
            updated: new Date("2025-11-24T09:12:00Z"),
            agent: "Microsoft-WebDAV-MiniRedir/6.1.7601",
            tokenId: 132,
            tokenType: TokenType.document,
            status: IncidentStatus.inProgress,
            assignedUserId: 101,
            tiedSubjectId: 701,
        },
        {
            incidentId: 3,
            isActive: true,
            title: 'Incident Incident Incident Incident #3',
            desc: "test",
            date: new Date("2025-11-16T15:58:00Z"),
            updated: new Date("2025-11-24T09:12:00Z"),
            agent: "Microsoft Office/16.0 (Windows NT 6.1; Microsoft Word 16.0.17126; ProPlus)",
            tokenId: 143,
            tokenType: TokenType.document,
            status: IncidentStatus.inProgress,
            assignedUserId: 102,
            tiedSubjectId: 702,
        },
        {
            incidentId: 4,
            isActive: true,
            title: 'Incident #4',
            desc: "",
            date: new Date("2025-11-17T21:05:00Z"),
            updated: new Date("2025-11-24T09:12:00Z"),
            agent: "Microsoft-WebDAV-MiniRedir/10.0.22621",
            tokenId: 900,
            tokenType: TokenType.email,
            status: IncidentStatus.New,
            assignedUserId: null,
            tiedSubjectId: null,
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