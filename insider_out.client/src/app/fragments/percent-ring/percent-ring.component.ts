import { Component, Input } from '@angular/core';

@Component({
    selector: 'io-percent-ring',
    standalone: true,
    templateUrl: './percent-ring.component.html',
    styleUrls: ['./percent-ring.component.scss']
})
export class PercentRingComponent {
    @Input({ required: true }) percentage: number = 0; 
    @Input() label?: string; 

    radius = 21; 
    circumference = 2 * Math.PI * this.radius;

    getDashOffset(): number {
        const clampedPercentage = Math.max(0, Math.min(100, this.percentage));
        return this.circumference - (clampedPercentage / 100) * this.circumference;
    }

    getColor(): string {
        const p = this.percentage;
        if (p < 25) return 'var(--percent-0)';
        if (p < 50) return 'var(--percent-1)';
        if (p < 75) return 'var(--percent-2)';
        return 'var(--percent-3)';
    }
}