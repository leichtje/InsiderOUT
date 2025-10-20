import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ThemeService } from "../../services/theme.service";
import { BreakpointService } from "../../services/breakpoint.service";


@Component({
    selector:'io-header',
    templateUrl:'header.component.html',
    styleUrl:'header.component.scss',
    standalone:true,
    imports: [
		CommonModule,
		RouterLink,
      	RouterLinkActive
    ],

})

export class HeaderComponent {

	constructor(public themeService: ThemeService, public breakpointService: BreakpointService) {}

	toggleTheme() {
		this.themeService.toggleTheme();
	}

}
