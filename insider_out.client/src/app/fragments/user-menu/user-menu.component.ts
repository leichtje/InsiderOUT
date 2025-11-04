import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { BidiModule } from "@angular/cdk/bidi";
import { MatIcon } from "@angular/material/icon";
import { BreakpointService } from "../../services/breakpoint.service";
import { UserAvatarComponent } from "../avatar/avatar.component";
import { UserModel } from "../../models/person.model";
import { Observable } from "rxjs";
import { UserService } from "../../services/user.service";

@Component({
    selector:'io-user-menu',
    templateUrl:'user-menu.component.html',
    styleUrl:'user-menu.component.scss',
    standalone:true,
    imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    BidiModule,
    MatIcon,
    UserAvatarComponent,
],

})

export class UserMenuComponent {

    isUserMenuOpen = input<boolean>();


    protected userService = inject(UserService);
    
    constructor(public breakpointService: BreakpointService) {}
    
}
