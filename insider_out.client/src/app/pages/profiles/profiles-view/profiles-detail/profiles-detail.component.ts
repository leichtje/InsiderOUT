import { Component, computed, effect, inject } from "@angular/core";
import { SubjectService } from "../../../../services/subject.service";
import { ActivatedRoute } from "@angular/router";
import { ProfileCardComponent } from "../../../../fragments/profile-card/profile-card.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { UserStore } from "../../../../stores/user.store";

@Component({
    selector:'io-profiles-detail',
    templateUrl:'profiles-detail.component.html',
    standalone:true,
    imports: [ ProfileCardComponent]
})

export class ProfilesDetailComponent {
    private route = inject(ActivatedRoute);
    
    protected userStore = inject(UserStore);
    private subjectService = inject(SubjectService);

    private params = toSignal(this.route.paramMap);
    private url = toSignal(this.route.url);

    constructor() {
        effect(() => {
            const p = this.params();
            const u = this.url();
            
            if (!p || !u) return;

            const id = +p.get('id')!;
            const type = u[0].path;

            if (type === 'user') {
                this.userStore.selectUser(id);
            } else {
                this.subjectService.getSubjectById(id).subscribe(); 
            }
        });
    }

    currentProfile = computed(() => {
        const url = this.url();
        if (url?.[0].path === 'user') {
            return this.userStore.selectedUser();
        } 
            return null; 
    });

    isLoading = this.userStore.isLoading;
}
