import { CommonModule } from "@angular/common";
import { Component, Signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ThemeService } from "../../services/theme.service";
import { BreakpointService } from "../../services/breakpoint.service";
import { BidiModule } from "@angular/cdk/bidi";
import { MatIcon } from "@angular/material/icon";


interface SidebarItem {
    title: string;
    icon: string;
    route: string;
}


@Component({
    selector:'io-sidebar',
    templateUrl:'sidebar.component.html',
    styleUrl:'sidebar.component.scss',
    standalone:true,
    imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    BidiModule,
    MatIcon
],

})

export class SidebarComponent {

    // public isCollapsed: Signal<boolean> = true;

    public dashboard: SidebarItem = { title: "Dashboard", icon: 'dashboard', route: '/dashboard'};
    public incidents: SidebarItem = { title: "Incidents", icon: 'dashboard', route: '/incidents'};
    public create: SidebarItem = { title: "Create", icon: 'dashboard', route: '/create'};


    public sidebarItems: SidebarItem[] = [
        this.dashboard,
        this.incidents,
        this.create
    ]


	constructor(public themeService: ThemeService, public breakpointService: BreakpointService) {}


}
