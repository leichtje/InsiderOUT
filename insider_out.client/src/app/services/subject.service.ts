import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SubjectModel } from '../models/profile.model';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {

    private subjectsSignal = signal<SubjectModel[]>([
        {
            subjectId: 700,
            firstName: "Matthew",
            lastName: "Price",
            email: "matthew@example.com",
            department: "Cybersecurity",
            role: "Senior Data Analyst",
            phone: '513-555-5555',
            riskScore: 25,
        },
        {
            subjectId: 701,
            firstName: "Jonathon",
            lastName: "Leicht",
            email: "jonathon@example.com",
            department: "Cybersecurity",
            role: "Cyber Security Engineer",
            phone: '513-555-5555',
            riskScore: 15,
        },
        {
            subjectId: 702,
            firstName: "Nitin",
            lastName: "Penmetsa",
            email: "nitin@example.com",
            department: 'Cybersecurity',
            role: "Information Security Officer",
            phone: '513-555-5555',
            riskScore: 35,
        },
        {
            subjectId: 703,
            firstName: "Chetan",
            lastName: "Penmetsaaaaaaa",
            email: "chetan@example.com",
            department: "Cybersecurity",
            role: "Cyber Security Analyst",
            phone: '513-555-5555',
            riskScore: 15,
        }
    ]);

    public subjects = this.subjectsSignal.asReadonly();

    constructor() { }

    public getSubjectById(id: number): Observable<SubjectModel | undefined> {
        const subjectList = this.subjectsSignal();
        
        const subject = subjectList.find(s => s.subjectId === id);
        
        return of(subject);
    }
}