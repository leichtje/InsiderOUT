import { CommonModule } from "@angular/common";
import { Component, input, signal, Signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ThemeService } from "../../services/theme.service";
import { BreakpointService } from "../../services/breakpoint.service";
import { BidiModule } from "@angular/cdk/bidi";
import { MatIcon } from "@angular/material/icon";

interface SidebarItem {
    title: string;
    icon: string;
    route: string;
    subpages?: {
        title: string,
        route: string
    }[];
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
    
    isMobileSidebarOpen = input<boolean>();

    public openItem = signal<string | null>(null);
    
    constructor(public breakpointService: BreakpointService) {}

    public dashboard: SidebarItem = { 
        title: "Dashboard",
        icon: "dashboard",
        route: "/dashboard"
    };
    
    public incidents: SidebarItem = {
        title: "Incidents",
        icon: "policy_alert",
        route: "/incidents", 
        subpages: 
        [
            { 
                title: "Open", 
                route: "/incidents/open"
            },
            { 
                title: "Past", 
                route: "/incidents/past"
            }
        ] 
    };
    
    public create: SidebarItem = { 
        title: "Create",
        icon: "create_new_folder",
        route: "/create",
        subpages: 
        [
            { 
                title: "Documents", 
                route: "/create/documents"
            },
            { 
                title: "Emails", 
                route: "/create/emails"
            }
        ] 
    };

    public sidebarItems: SidebarItem[] = [
        this.dashboard,
        this.incidents,
        this.create
    ]


    toggleSubpages(itemTitle: string): void {
      if (this.openItem() === itemTitle) {
        this.openItem.set(null);
      } else {
        this.openItem.set(itemTitle);
      }
    }

}
