import { Component, inject } from "@angular/core";
import { switchMap } from "rxjs";
import { SubjectService } from "../../../../services/subject.service";
import { UserService } from "../../../../services/user.service";
import { ActivatedRoute } from "@angular/router";
import { AsyncPipe } from "@angular/common";
import { UserProfileComponent } from "../../../../fragments/user-profile/user-profile.component";

@Component({
    selector:'io-user-detail-detail',
    templateUrl:'user-detail-detail.component.html',
    // styleUrl:'user-detail-detail.component.scss',
    standalone:true,
    imports: [AsyncPipe, UserProfileComponent]
})

export class UserDetailDetailComponent {

    private route = inject(ActivatedRoute);
    private userService = inject(UserService);
    private subjectService = inject(SubjectService);

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

}
