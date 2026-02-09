import { Component, computed, effect, inject, signal } from "@angular/core";
import { SubjectService } from "../../../../services/subject.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { ProfileCardComponent } from "../../../../fragments/profile-card/profile-card.component";
import { SubjectModel, UserModel } from "../../../../models/profile.model";
import { toSignal } from "@angular/core/rxjs-interop";
import { UserStore } from "../../../../stores/user.store";
import { SubjectStore } from "../../../../stores/subject.store";

@Component({
    selector:'io-profiles-detail',
    templateUrl:'profiles-detail.component.html',
    standalone:true,
    imports: [AsyncPipe, ProfileCardComponent]
})

export class ProfilesDetailComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    
    protected userStore = inject(UserStore);
    protected subjectStore = inject(SubjectStore);

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
            } else {
                this.subjectStore.selectSubject(id);
            }
        });
    }

    profile = computed(() => {
        const type = this.urlSegments()?.[0].path;

        if (type === 'user') {
            return this.userStore.selectedUser();
        } else {
            return this.subjectStore.selectedSubject();
        }
    });

    isSubject(profile: UserModel | SubjectModel): profile is SubjectModel {
        return 'subjectId' in profile;
    }

    onDelete(profile: UserModel | SubjectModel) {
        if (!confirm('Are you sure you want to delete this profile?')) {
            return;
        }

        if (this.isSubject(profile)) {
            this.subjectStore.delete(profile.subjectId);
        } else {
            this.userStore.delete(profile.userId);
        }

        this.router.navigate(['../../'], { relativeTo: this.route });
    }
}