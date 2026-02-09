
import { Component, computed, effect, inject, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { BidiModule } from "@angular/cdk/bidi";
import { MatIcon } from "@angular/material/icon";
import { BreakpointService } from "../../services/breakpoint.service";
import { ProfileAvatarComponent } from "../profile-avatar/profile-avatar.component";
import { UserStore } from "../../stores/user.store";

@Component({
    selector:'io-user-menu',
    templateUrl:'user-menu.component.html',
    styleUrl:'user-menu.component.scss',
    standalone:true,
    imports: [
    RouterLink,
    RouterLinkActive,
    BidiModule,
    MatIcon,
    ProfileAvatarComponent
],

})

export class UserMenuComponent {

    isUserMenuOpen = input<boolean>();

    protected userStore = inject(UserStore); 
    
    constructor(public breakpointService: BreakpointService) {}
    
}
