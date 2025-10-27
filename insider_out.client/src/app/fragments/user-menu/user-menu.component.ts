import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { BidiModule } from "@angular/cdk/bidi";
import { MatIcon } from "@angular/material/icon";
import { BreakpointService } from "../../services/breakpoint.service";

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
    MatIcon
],

})

export class UserMenuComponent {


    isUserMenuOpen = input<boolean>();

    constructor(public breakpointService: BreakpointService) {}
    


}
