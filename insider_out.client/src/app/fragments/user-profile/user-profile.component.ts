import { Component, input } from "@angular/core";
import { SubjectModel, UserModel } from "../../models/person.model";
import { UserAvatarComponent } from "../avatar/avatar.component";

@Component({
    selector:'io-user-profile',
    templateUrl:'user-profile.component.html',
    styleUrl:'user-profile.component.scss',
    standalone:true,
    imports:[UserAvatarComponent]
})

export class UserProfileComponent {

    person = input<UserModel | SubjectModel | null>();

}
