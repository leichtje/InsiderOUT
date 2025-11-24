import { Component, input, output, computed, inject } from "@angular/core"; 
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ThemeService } from "../../services/theme.service";
import { BreakpointService } from "../../services/breakpoint.service";
import { MatIcon } from "@angular/material/icon";
import { ProfileAvatarComponent } from "../profile-avatar/profile-avatar.component";
import { UserService } from "../../services/user.service";


@Component({
    selector:'io-header',
    templateUrl:'header.component.html',
    styleUrl:'header.component.scss',
    standalone:true,
    imports: [
		CommonModule,
		RouterLink,
		RouterLinkActive,
		MatIcon,
		ProfileAvatarComponent
	],
    host: {
        '[class.menu-is-open]': 'isAnyMenuOpen()'
    }
})
export class HeaderComponent {

	isOpenMobileSidebar = input<boolean>(false); 
	isOpenUserMenu = input<boolean>(false); 

	isMobileSidebarOpen = output<boolean>();
	isUserMenuOpen = output<boolean>();

    isAnyMenuOpen = computed(() => this.isOpenMobileSidebar() || this.isOpenUserMenu());

    protected userService = inject(UserService);

	constructor(public themeService: ThemeService, public breakpointService: BreakpointService) { }

	toggleTheme() {
		this.themeService.toggleTheme();
	}

	toggleMobileSidebar() {
		this.isMobileSidebarOpen.emit(!this.isOpenMobileSidebar());
		if (this.isOpenUserMenu()) {
			this.isUserMenuOpen.emit(!this.isOpenUserMenu());
		}
	}

	toggleUserMenu() {
		this.isUserMenuOpen.emit(!this.isOpenUserMenu());
		if (this.isOpenMobileSidebar()) {
			this.isMobileSidebarOpen.emit(!this.isOpenMobileSidebar());
		}
	}

	handleBackdrop() {
		if (this.isOpenMobileSidebar()) {
			this.isMobileSidebarOpen.emit(!this.isOpenMobileSidebar());
		}
		else {
			this.isUserMenuOpen.emit(!this.isOpenUserMenu());
		}
	}
}