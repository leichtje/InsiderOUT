
import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SubjectService } from '../../services/subject.service';
import { SubjectModel, UserModel } from '../../models/profile.model';
import { filter, map, startWith } from 'rxjs';
import { ProfilesViewComponent } from './profiles-view/profiles-view.component';
import { UserStore } from '../../stores/user.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { SubjectStore } from '../../stores/subject.store';
import { ProfileDialogComponent } from './profiles-add-dialog/profiles-dialog.component';

@Component({
    selector: 'io-profiles',
    templateUrl: './profiles.component.html',
    standalone: true,
    imports: [ProfilesViewComponent, ProfileDialogComponent]
})
export class ProfilesComponent {
    readonly dialog = viewChild.required(ProfileDialogComponent);

    readonly dialogType = signal<'user' | 'subject'>('user');
    readonly dialogData = signal<UserModel | SubjectModel | null>(null);

    protected userStore = inject(UserStore);
    protected subjectStore = inject(SubjectStore);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    protected users = this.userStore.users; 
    protected subjects = this.subjectStore.subjects; 

    private activeRouteState = toSignal(
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            startWith(null), 
            map(() => {
                const child = this.route.firstChild;
                
                const id = child?.snapshot?.paramMap?.get('id');
                const type = child?.snapshot?.url?.[0]?.path; 

                return { 
                    id: id ? +id : null, 
                    type: type as 'user' | 'subject' | null 
                };
            })
        ),
        { initialValue: { id: null, type: null } }
    );

    readonly activeId = computed(() => this.activeRouteState()?.id);
    readonly activeType = computed(() => this.activeRouteState()?.type);

    onProfileSelected(profile: UserModel | SubjectModel) {
        const isUser = 'userId' in profile;
        const type = isUser ? 'user' : 'subject';
        const id = isUser ? profile.userId : profile.subjectId;

        if (isUser) {
            this.userStore.selectUser(id);
        } else {
            this.subjectStore.selectSubject(id);

        }

        this.router.navigate([`./${type}`, id], { relativeTo: this.route });
    }

    openCreate() {
        this.dialogType.set('subject');
        this.dialogData.set(null); 
        this.dialog().open();
    }

}