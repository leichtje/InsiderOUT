import { Component, Input, Output, EventEmitter, HostListener } from "@angular/core"; 
import { CommonModule } from "@angular/common";

@Component({
    selector: 'io-action-bar',
    templateUrl: 'action-bar.component.html',
    styleUrl: 'action-bar.component.scss',
    standalone: true,
    imports: [CommonModule],
})
export class ActionBarComponent {
    @Input() isOpen = false;
    @Output() save = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.isOpen) {
            $event.returnValue = true;
        }
    }
}