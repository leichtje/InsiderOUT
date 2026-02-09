export interface SidebarItem {
    title: string;
    icon: string;
    route?: string;
    subpages?: {
        title: string;
        route: string;
    }[];
}