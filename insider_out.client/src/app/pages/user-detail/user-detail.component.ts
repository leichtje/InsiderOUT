import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {UserDetailViewComponent } from './user-detail-view/user-detail-view.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SubjectService } from '../../services/subject.service';
import { SubjectModel, UserModel } from '../../models/person.model';
import { filter } from 'rxjs';

@Component({
    selector: 'io-user-detail',
    templateUrl: './user-detail.component.html',
    standalone: true,
    imports: [CommonModule, UserDetailViewComponent, RouterOutlet]
})
export class UserDetailComponent {

protected userService = inject(UserService);
    protected subjectService = inject(SubjectService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    protected users = this.userService.users;
    protected subjects = this.subjectService.subjects;

    protected activeId = signal<number | null>(null);
    protected activeType = signal<'user' | 'subject' | null>(null);

    constructor() {
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
        let child = this.route.firstChild;

        if (child) {
            const id = child.snapshot.paramMap.get('id');
            const type = child.snapshot.url[0].path;
            
            this.activeId.set(id ? +id : null);
            this.activeType.set(type as any);

        } else {
            this.activeId.set(null);
            this.activeType.set(null);
        }
        });
    }

    onPersonSelected(person: UserModel | SubjectModel) {
        const type = 'userId' in person ? 'user' : 'subject';
        const id = 'userId' in person ? person.userId : person.subjectId;

        this.router.navigate([`./${type}`, id], { relativeTo: this.route });
    }
}
