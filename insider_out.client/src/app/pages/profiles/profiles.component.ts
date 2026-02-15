
import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SubjectService } from '../../services/subject.service';
import { SubjectModel, UserModel } from '../../models/profile.model';
import { debounce, filter, map, startWith } from 'rxjs';
import { ProfilesViewComponent } from './profiles-view/profiles-view.component';
import { UserStore } from '../../stores/user.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { SubjectStore } from '../../stores/subject.store';
import { ProfileDialogComponent } from './profiles-add-dialog/profiles-dialog.component';
import { ResponsiveDialogService } from '../../services/responsive-dialog.service';

@Component({
    selector: 'io-profiles',
    templateUrl: './profiles.component.html',
    standalone: true,
    imports: [ProfilesViewComponent]
})
export class ProfilesComponent {
    protected userStore = inject(UserStore);
    protected subjectStore = inject(SubjectStore);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private dialog = inject(ResponsiveDialogService);

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

    readonly searchQuery = signal<string>('');

    filteredUsers = computed(() => {
        const query = this.searchQuery().toLowerCase();
        const users = this.userStore.users();

        if (!query) return users;

        return users.filter(u => 
            u.firstName.toLowerCase().includes(query) ||
            u.lastName.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query)
        );
    });

    filteredSubjects = computed(() => {
        const query = this.searchQuery().toLowerCase();
        const subjects = this.subjectStore.subjects();

        if (!query) return subjects;

        return subjects.filter(s => 
            s.firstName.toLowerCase().includes(query) ||
            s.lastName.toLowerCase().includes(query) ||
            s.email.toLowerCase().includes(query)
        );
    });

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


    openCreate(type: 'user' | 'subject') {
        this.dialog.open(ProfileDialogComponent, {
            data: { type: type, profile: null }
        });
    }

    onSearch(searchQuery: string) {
        this.searchQuery.set(searchQuery);
    }

}