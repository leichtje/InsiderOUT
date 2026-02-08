import { CommonModule } from "@angular/common";
import { Component, input, output, OutputEmitterRef } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'io-dialog-header',
    templateUrl: './dialog-header.component.html',
    styleUrl: './dialog-header.component.scss',
    standalone: true,
    imports: [CommonModule, MatIconModule]
})
export class IncidentsListComponent {
    readonly title = input.required<string>();
    readonly showClose = input<boolean>();
    
    readonly close = output<void>();


    onClose() {
        this.close.emit();
    }
}