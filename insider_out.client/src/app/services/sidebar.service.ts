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
        subpages: [
            { title: "Open", route: "/incidents/open" },
            { title: "Closed", route: "/incidents/closed" }
        ] 
    },
    { 
        title: "Tokens",
        icon: "create_new_folder",
        subpages: [
            { title: "Documents", route: "/tokens/documents" },
        ] 
    },
    { 
        title: "Settings",
        icon: "settings",
        subpages: [
            { title: "Profiles", route: "/settings/profiles" },
            { title: "Department", route: "/settings/department" }
        ] 
    },
    ];

    getSidebarItems(): SidebarItem[] {
        //if (this.authService.isAdmin())
        return this.sidebarItems;
    }
}