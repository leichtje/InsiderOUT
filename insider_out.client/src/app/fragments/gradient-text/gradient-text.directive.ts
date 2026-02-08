import { Directive, ElementRef, OnDestroy, OnInit, inject, Renderer2 } from '@angular/core';

@Directive({
    selector: '[ioGradientText]',
    standalone: true
})
export class GradientTextDirective implements OnInit, OnDestroy {

    private el = inject(ElementRef);
    private renderer = inject(Renderer2);

    private originalText = '';
    private intervalId: any;

    ngOnInit() {
        this.renderer.addClass(this.el.nativeElement, 'io-gradient-text');

        const currentText = this.el.nativeElement.innerText;
        this.originalText = currentText.replace(/\.+$/, '');

        let dotCount = 0;
        this.intervalId = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            const dots = '.'.repeat(dotCount);
            
            this.el.nativeElement.innerText = `${this.originalText}${dots}`;
        }, 500);
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}