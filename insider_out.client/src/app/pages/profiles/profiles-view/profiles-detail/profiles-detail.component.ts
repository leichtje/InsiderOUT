import { Component, computed, effect, inject, signal } from "@angular/core";
import { SubjectService } from "../../../../services/subject.service";
import { ActivatedRoute } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { ProfileCardComponent } from "../../../../fragments/profile-card/profile-card.component";
import { SubjectModel, UserModel } from "../../../../models/profile.model";
import { toSignal } from "@angular/core/rxjs-interop";
import { UserStore } from "../../../../stores/user.store";

@Component({
    selector:'io-profiles-detail',
    templateUrl:'profiles-detail.component.html',
    standalone:true,
    imports: [AsyncPipe, ProfileCardComponent]
})

export class ProfilesDetailComponent {
    private route = inject(ActivatedRoute);
    private subjectService = inject(SubjectService);

    protected userStore = inject(UserStore);

    private currentSubject = signal<SubjectModel | null>(null);

    private params = toSignal(this.route.paramMap);
    private urlSegments = toSignal(this.route.url);

    constructor() {
        effect(() => {
            const p = this.params();
            const u = this.urlSegments();
            
            if (!p || !u) return;

            const id = +p.get('id')!;
            const type = u[0].path;

            if (type === 'user') {
                this.userStore.selectUser(id); 
                this.currentSubject.set(null);
            } else {
                this.subjectService.getSubjectById(id).subscribe(sub => {
                    this.currentSubject.set(sub || null);
                });
            }
        });
    }

    profile = computed(() => {
        const type = this.urlSegments()?.[0].path;

        if (type === 'user') {
            return this.userStore.selectedUser();
        } else {
            return this.currentSubject();
        }
    });

    isSubject(profile: UserModel | SubjectModel): profile is SubjectModel {
        return 'subjectId' in profile;
    }
}
