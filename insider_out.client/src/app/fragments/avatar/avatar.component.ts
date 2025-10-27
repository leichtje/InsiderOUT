import { Component, input } from "@angular/core";
import { UserModel } from "../../models/user.model";
import { AvatarViewComponent } from "./avatar-view/avatar-view.component";

@Component({
    selector:'io-avatar',
    templateUrl:'avatar.component.html',
    standalone:true,
    imports: [
        AvatarViewComponent
    ],

})

export class AvatarComponent {

    userid = input<number>();

    // need to retrieve
    user: UserModel = {
        userId: 1234,
        firstName: "Logan",
        lastName: "Freeman",
    };



}
