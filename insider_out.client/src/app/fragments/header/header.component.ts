import { Component, input, output, computed, inject } from "@angular/core"; 
import { ThemeService } from "../../services/theme.service";
import { BreakpointService } from "../../services/breakpoint.service";
import { MatIcon } from "@angular/material/icon";
import { ProfileAvatarComponent } from "../profile-avatar/profile-avatar.component";
import { UserStore } from "../../stores/user.store";

@Component({
    selector:'io-header',
    templateUrl:'header.component.html',
    styleUrl:'header.component.scss',
    standalone:true,
    imports: [
		MatIcon,
		ProfileAvatarComponent
	],
    host: {
        '[class.menu-is-open]': 'isAnyMenuOpen()'
    }
})
export class HeaderComponent {

	protected userStore = inject(UserStore); 

	readonly isOpenMobileSidebar$ = input<boolean>(false, {alias: 'isOpenMobileSidebar'}); 
	readonly isOpenUserMenu$ = input<boolean>(false, {alias: 'isOpenUserMenu'}); 

	readonly isMobileSidebarOpen = output<boolean>();
	readonly isUserMenuOpen = output<boolean>();

    isAnyMenuOpen = computed(() => this.isOpenMobileSidebar$() || this.isOpenUserMenu$());

	constructor(public themeService: ThemeService, public breakpointService: BreakpointService) { }

	toggleTheme() {
		this.themeService.toggleTheme();
	}

	toggleMobileSidebar() {
		this.isMobileSidebarOpen.emit(!this.isOpenMobileSidebar$());
		if (this.isOpenUserMenu$()) {
			this.isUserMenuOpen.emit(!this.isOpenUserMenu$());
		}
	}

	toggleUserMenu() {
		this.isUserMenuOpen.emit(!this.isOpenUserMenu$());
		if (this.isOpenMobileSidebar$()) {
			this.isMobileSidebarOpen.emit(!this.isOpenMobileSidebar$());
		}
	}

	handleBackdrop() {
		if (this.isOpenMobileSidebar$()) {
			this.isMobileSidebarOpen.emit(!this.isOpenMobileSidebar$());
		}
		else {
			this.isUserMenuOpen.emit(!this.isOpenUserMenu$());
		}
	}
}