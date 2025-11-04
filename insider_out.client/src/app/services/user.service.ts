import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserModel } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


    private currentUserSignal = signal<UserModel>({
        userId: 101,
        firstName: 'Logan',
        lastName: 'Freeman',
        email: 'loganfree18@gmail.com'
    });

    private usersSignal = signal<UserModel[]>([
        {
            userId: 101,
            firstName: 'Logan',
            lastName: 'Freeman',
            email: 'loganfree18@gmail.com'
        },
        {
            userId: 102,
            firstName: 'Freeman',
            lastName: 'Logan',
            email: 'loganfree18@gmail.com'
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

}