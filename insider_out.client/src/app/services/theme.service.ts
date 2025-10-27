// 1. Import signal, effect, and Injector
import { Injectable, Renderer2, RendererFactory2, signal, effect, Injector } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private renderer: Renderer2;

    private isDarkSignal = signal<boolean>(false);

    public isDark = this.isDarkSignal.asReadonly();

    constructor(
        rendererFactory: RendererFactory2, 
        private injector: Injector
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.loadTheme();
        this.createThemeEffect();
    }

    private loadTheme() {
        const savedTheme = localStorage.getItem('isDark');
        this.isDarkSignal.set(savedTheme ? JSON.parse(savedTheme) : false);
    }

    private createThemeEffect() {
        effect(() => {
            const isDark = this.isDarkSignal();
            
            localStorage.setItem('isDark', JSON.stringify(isDark));
            
            if (isDark) {
                this.renderer.addClass(document.body, 'dark-mode');
            } else {
                this.renderer.removeClass(document.body, 'dark-mode');
            }
        }, { injector: this.injector });
    }

    toggleTheme(): void {
        this.isDarkSignal.update(value => !value);
    }
}