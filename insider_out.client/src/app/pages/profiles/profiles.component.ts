
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SubjectService } from '../../services/subject.service';
import { SubjectModel, UserModel } from '../../models/profile.model';
import { filter, map, startWith } from 'rxjs';
import { ProfilesViewComponent } from './profiles-view/profiles-view.component';
import { UserStore } from '../../stores/user.store';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'io-profiles',
    templateUrl: './profiles.component.html',
    standalone: true,
    imports: [ProfilesViewComponent]
})
export class ProfilesComponent {
    
    protected userStore = inject(UserStore);
    protected subjectService = inject(SubjectService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    protected users = this.userStore.users; 
    protected subjects = this.subjectService.subjects; 

    private activeRouteState = toSignal(
        this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null), 
        map(() => {
            const child = this.route.firstChild;
            if (child) {
            const id = child.snapshot.paramMap.get('id');
            const type = child.snapshot.url[0]?.path; 
            return { 
                id: id ? +id : null, 
                type: type as 'user' | 'subject' | null 
            };
            }
            return { id: null, type: null };
        })
        ),
        { initialValue: { id: null, type: null } }
    );

    activeId = computed(() => this.activeRouteState()?.id);
    activeType = computed(() => this.activeRouteState()?.type);

    onProfileSelected(profile: UserModel | SubjectModel) {
        const isUser = 'userId' in profile;
        const type = isUser ? 'user' : 'subject';
        const id = isUser ? profile.userId : profile.subjectId;

        if (isUser) {
            this.userStore.selectUser(id);
        }

        this.router.navigate([`./${type}`, id], { relativeTo: this.route });
    }
}