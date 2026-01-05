import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ActionBarService {
    private readonly BAR_HEIGHT = '80px'; 

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    setSpace(isOpen: boolean) {
        if (isPlatformBrowser(this.platformId)) {
        const value = isOpen ? this.BAR_HEIGHT : '0px';
        this.document.documentElement.style.setProperty('--action-bar-space', value);
        }
    }
}