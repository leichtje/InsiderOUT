import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SubjectService } from '../../services/subject.service';
import { SubjectModel, UserModel } from '../../models/profile.model';
import { filter } from 'rxjs';
import { ProfilesViewComponent } from './profiles-view/profiles-view.component';

@Component({
    selector: 'io-profiles',
    templateUrl: './profiles.component.html',
    standalone: true,
    imports: [CommonModule, RouterOutlet, ProfilesViewComponent]
})
export class ProfilesComponent {

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

    onProfileSelected(profile: UserModel | SubjectModel) {
        const type = 'userId' in profile ? 'user' : 'subject';
        const id = 'userId' in profile ? profile.userId : profile.subjectId;

        this.router.navigate([`./${type}`, id], { relativeTo: this.route });
    }
}
