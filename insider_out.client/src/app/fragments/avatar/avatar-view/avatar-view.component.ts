import { Component, input, computed } from "@angular/core";
import { UserModel } from "../../../models/user.model";

@Component({
    selector: 'io-avatar-view',
    templateUrl: 'avatar-view.component.html',
    styleUrl: 'avatar-view.component.scss',
    standalone: true,
})
export class AvatarViewComponent {

    user = input<UserModel>();

    initials = computed(() => {
    const currentUser = this.user();

    if (currentUser) {
        return currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0);
    }

        return null;
    });

}