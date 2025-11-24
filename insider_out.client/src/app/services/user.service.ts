import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SubjectModel, UserModel } from '../models/profile.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {


    private currentUserSignal = signal<UserModel>({
        userId: 101,
        firstName: 'Logan',
        lastName: 'Freeman',
        email: 'loganfree18@gmail.com',
        phone: '513-555-5555'
    });

    private usersSignal = signal<UserModel[]>([
        {
            userId: 101,
            firstName: 'Logan',
            lastName: 'Freeman',
            email: 'loganfree18@gmail.com',
            phone: '513-555-5555'
        },
        {
            userId: 102,
            firstName: 'Freeman',
            lastName: 'Logan',
            email: 'freemanlogan@gmail.com',
            phone: '513-555-5555'
        },
    ]);

    public currentUser = this.currentUserSignal.asReadonly();

    public users = this.usersSignal.asReadonly();

    constructor() { }

    public setCurrentUser(user: UserModel) {
        this.currentUserSignal.set(user);
    }

    public getUserById(id: number): Observable<UserModel | undefined> {
        const userList = this.usersSignal(); 
        
        const user = userList.find(u => u.userId === id);
        
        return of(user);
    }

    public isCurrentUser(profile: UserModel | SubjectModel): boolean {
        if ('userId' in profile) {
            return profile.userId === this.currentUser().userId;
        }
        return false;
    }

}