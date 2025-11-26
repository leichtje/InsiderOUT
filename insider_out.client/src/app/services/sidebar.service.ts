import { Injectable } from '@angular/core';
import { SidebarItem } from '../models/sidebar.model';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    private sidebarItems: SidebarItem[] = [
    { 
        title: "Dashboard",
        icon: "dashboard",
        route: "/dashboard"
    },
    {
        title: "Incidents",
        icon: "policy_alert",
        route: "/incidents", 
        subpages: [
            { title: "Open", route: "/incidents/open" },
            { title: "Closed", route: "/incidents/closed" }
        ] 
    },
    { 
        title: "Tokens",
        icon: "create_new_folder",
        route: "/tokens",
        subpages: [
            { title: "Documents", route: "/tokens/documents" },
            { title: "Emails", route: "/tokens/emails" }
        ] 
    },
    { 
        title: "Profiles",
        icon: "account_box",
        route: "/profiles"
    },
    ];

    getSidebarItems(): SidebarItem[] {
        //if (this.authService.isAdmin())
        return this.sidebarItems;
    }
}