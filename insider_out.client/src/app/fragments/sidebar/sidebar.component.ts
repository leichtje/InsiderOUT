
import { Component, inject, input, OnDestroy, OnInit, signal } from "@angular/core";
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { BreakpointService } from "../../services/breakpoint.service";
import { BidiModule } from "@angular/cdk/bidi";
import { MatIcon } from "@angular/material/icon";
import { filter, Subscription } from "rxjs";
import { SidebarItem } from "../../models/sidebar.model";
import { NavigationService } from "../../services/sidebar.service";

@Component({
    selector:'io-sidebar',
    templateUrl:'sidebar.component.html',
    styleUrl:'sidebar.component.scss',
    standalone:true,
    imports: [
    RouterLink,
    RouterLinkActive,
    BidiModule,
    MatIcon
],

})

export class SidebarComponent implements OnInit, OnDestroy {
    
    readonly isMobileSidebarOpen$ = input.required<boolean>({alias: 'isMobileSidebarOpen'});
    public openItem = signal<string | null>(null);

    private router = inject(Router);
    private navService = inject(NavigationService);
    
    private routerSub!: Subscription;

    public sidebarItems: SidebarItem[] = [];

    constructor(public breakpointService: BreakpointService) {}

    ngOnInit(): void {
        this.sidebarItems = this.navService.getSidebarItems()
        this.routerSub = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(event => {
            const currentUrl = (event as NavigationEnd).urlAfterRedirects;
            this.expandActiveParent(currentUrl);
        });
        this.expandActiveParent(this.router.url);
    }

    ngOnDestroy(): void {
        if (this.routerSub) {
            this.routerSub.unsubscribe();
        }
    }

    private expandActiveParent(url: string): void {
        const activeParent = this.sidebarItems.find(item =>
            item.subpages?.some(subpage => url.startsWith(subpage.route))
        );

        if (activeParent) {
            this.openItem.set(activeParent.title);
        }
    }

    toggleSubpages(itemTitle: string): void {
        if (this.openItem() === itemTitle) {
            this.openItem.set(null);
        } else {
            this.openItem.set(itemTitle);
        }
    }

    openMainItem(): void {
        this.openItem.set(null);
    }

}
