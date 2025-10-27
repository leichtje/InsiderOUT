import { AfterViewInit, Component, computed, effect, ElementRef, inject, input, OnDestroy, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { BreakpointService } from './services/breakpoint.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnDestroy {
    title = 'insider_out.client';

    public breakpointService = inject(BreakpointService);

    constructor() {
        effect(() => {
            if (!this.breakpointService.isPhone()) {
                this.isMobileSidebarOpen.set(false);
                this.isUserMenuOpen.set(false);
            }
        });

    }

    isMobileSidebarOpen = signal(false);
    isUserMenuOpen = signal(false);

    private userMenuMeasuredWidth = signal(0); 

    mainContentWidth = computed(() => {
        if (this.isUserMenuOpen() && !this.breakpointService.isPhone()) {
            return `calc(100% - ${this.userMenuMeasuredWidth()}px)`;
        } else {
            return '100%';
        }
    });
    
    @ViewChild('userMenu', { read: ElementRef }) userMenuRef!: ElementRef;
    private resizeObserver!: ResizeObserver;

    ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(entries => {
        const menuWidth = entries[0].contentRect.width;
        if (menuWidth > 0) {
            this.userMenuMeasuredWidth.set(menuWidth);
        }
    });

    this.resizeObserver.observe(this.userMenuRef.nativeElement);
    }

    ngOnDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}
