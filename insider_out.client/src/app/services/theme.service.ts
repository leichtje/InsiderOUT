import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
    private renderer: Renderer2;
    private isDark = false;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.loadTheme();
    }

    private loadTheme() {
        const savedTheme = localStorage.getItem('isDarkMode');
        this.isDark = savedTheme ? JSON.parse(savedTheme) : false;

        if (this.isDark) {
            this.renderer.addClass(document.body, 'dark-mode');
        } else {
            this.renderer.removeClass(document.body, 'dark-mode');
        }
    }

    isDarkMode(): boolean {
        return this.isDark;
    }

    toggleTheme(): void {
        this.isDark = !this.isDark;
        localStorage.setItem('isDarkMode', JSON.stringify(this.isDark));

        if (this.isDark) {
            this.renderer.addClass(document.body, 'dark-mode');
        } else {
            this.renderer.removeClass(document.body, 'dark-mode');
        }
    }
}