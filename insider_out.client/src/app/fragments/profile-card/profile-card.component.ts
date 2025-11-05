import { Component, input } from "@angular/core";
import { SubjectModel, UserModel } from "../../models/profile.model";
import { ProfileAvatarComponent } from "../profile-avatar/profile-avatar.component";

@Component({
    selector:'io-profile-card',
    templateUrl:'profile-card.component.html',
    styleUrl:'profile-card.component.scss',
    standalone:true,
    imports:[ProfileAvatarComponent]
})

export class ProfileCardComponent {

    profile = input<UserModel | SubjectModel | null>();

}
