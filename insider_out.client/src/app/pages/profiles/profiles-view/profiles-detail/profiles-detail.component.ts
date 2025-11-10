import { Component, inject } from "@angular/core";
import { switchMap } from "rxjs";
import { SubjectService } from "../../../../services/subject.service";
import { UserService } from "../../../../services/user.service";
import { ActivatedRoute } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { ProfileCardComponent } from "../../../../fragments/profile-card/profile-card.component";
import { SubjectModel, UserModel } from "../../../../models/profile.model";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
    selector:'io-profiles-detail',
    templateUrl:'profiles-detail.component.html',
    standalone:true,
    imports: [AsyncPipe, ProfileCardComponent]
})

export class ProfilesDetailComponent {

    private route = inject(ActivatedRoute);
    protected userService = inject(UserService);
    private subjectService = inject(SubjectService);

    protected currentUser = this.userService.currentUser;

    profile$ = this.route.paramMap.pipe(
        switchMap(params => {
            const id = +params.get('id')!;
            const type = this.route.snapshot.url[0].path; 

            if (type === 'user') {
                return this.userService.getUserById(id);
            } else {
                return this.subjectService.getSubjectById(id);
            }
        })
    );

    profile = toSignal(this.profile$, { initialValue: null });

    isSubject(profile: UserModel | SubjectModel): boolean {
        return 'subjectId' in profile;
    }

}
