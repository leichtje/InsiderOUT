import { Injectable, signal, computed, OnDestroy, WritableSignal, Signal } from '@angular/core';

export interface BreakpointState {
    isWeb: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isPhone: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class BreakpointService implements OnDestroy {

    private readonly state: WritableSignal<BreakpointState>;

    public isWeb: Signal<boolean>;
    public isMobile: Signal<boolean>;
    public isTablet: Signal<boolean>;
    public isPhone: Signal<boolean>;

    constructor() {
        this.state = signal(this.getBreakpointState());

        this.isWeb = computed(() => this.state().isWeb);
        this.isMobile = computed(() => this.state().isMobile);
        this.isTablet = computed(() => this.state().isTablet);
        this.isPhone = computed(() => this.state().isPhone);

        window.addEventListener('resize', this.onResize);
    }

    ngOnDestroy(): void {
        window.removeEventListener('resize', this.onResize);
    }

    private onResize = (): void => {
        this.state.set(this.getBreakpointState());
    };

    private getBreakpointState(): BreakpointState {
        const width = window.innerWidth;
        const isPhone = width <= 600;
        const isTablet = width > 600 && width <= 1000;
        const isMobile = width <= 1000;
        const isWeb = width > 1000;
        return { isWeb, isMobile, isTablet, isPhone };
    }
}