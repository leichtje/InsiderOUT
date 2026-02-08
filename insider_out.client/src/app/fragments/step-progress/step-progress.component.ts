
import { Component, Input } from "@angular/core";

export interface StepDefinition {
    label: string;
    percentage: number;
    isActive: boolean;
    isCompleted: boolean; 
}

@Component({
    selector: 'io-step-progress',
    standalone: true,
    imports: [],
    templateUrl: './step-progress.component.html',
    styleUrl: './step-progress.component.scss'
})
export class StepProgressComponent {
    @Input() steps: StepDefinition[] = [];


    radius = 20;
    circumference = 2 * Math.PI * this.radius;

    getDashOffset(percentage: number): number {
        const progress = percentage / 100;
        return this.circumference * (1 - progress);
    }
}