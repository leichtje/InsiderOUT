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
    @Input() size: number = 50; 
    
    strokeWidth: number = 4; 

    get center(): number {
        return this.size / 2;
    }

    get radius(): number {
        return this.center - this.strokeWidth;
    }

    get circumference(): number {
        return 2 * Math.PI * this.radius;
    }

    getDashOffset(): number {
        const clampedPercentage = Math.max(0, Math.min(100, this.percentage));
        return this.circumference - (clampedPercentage / 100) * this.circumference;
    }

    getColor(): string {
        const p = this.percentage;
        if (p < 25) return 'var(--color-danger, #ef4444)';  
        if (p < 50) return 'var(--color-warning, #f97316)'; 
        if (p < 75) return 'var(--color-info, #eab308)';    
        return 'var(--color-success, #22c55e)';             
    }
}