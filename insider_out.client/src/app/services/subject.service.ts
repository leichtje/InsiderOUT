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
            title: "Senior Data Analyst"
        },
        {
            subjectId: 701,
            firstName: "Jonathon",
            lastName: "Leicht",
            email: "jonathon@example.com",
            department: "Cybersecurity"
        },
        {
            subjectId: 702,
            firstName: "Nitin",
            lastName: "Penmetsa",
            email: "nitin@example.com",
            department: 'Cybersecurity'
        },
        {
            subjectId: 703,
            firstName: "Chetan",
            lastName: "Penmetsaaaaaaaaaaaaa",
            email: "chetan@example.com",
            department: "Cybersecurity"
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