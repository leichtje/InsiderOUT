import { Component, computed, inject, input } from "@angular/core";
import { ProfileModel } from "../../models/profile.model";
import { ThemeService } from "../../services/theme.service";

@Component({
    selector:'io-profile-avatar',
    templateUrl:'profile-avatar.component.html',
    styleUrl:'profile-avatar.component.scss',
    standalone:true
})

export class ProfileAvatarComponent {

    profile = input<ProfileModel | null>();

    enableHover = input(false);

    initials = computed(() => {
        const currentUser = this.profile();

        if (currentUser?.firstName && currentUser?.lastName) {
            return (currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)).toUpperCase();
        }
        
        return null;
    });

    backgroundColor = computed(() => {
        const currentInitials = this.initials();
        
        if (currentInitials) {
            const charCode = currentInitials.charCodeAt(0);
            const colorIndex = charCode % 10; 
            
            return `var(--avatar-${colorIndex})`;
        }

        return 'var(--color-gray)'; 
    });


}
