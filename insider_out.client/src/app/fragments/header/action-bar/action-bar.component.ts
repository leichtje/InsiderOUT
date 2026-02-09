import { Component, Input, Output, EventEmitter, HostListener, SimpleChanges, inject } from "@angular/core"; 

import { ActionBarService } from "../../../services/action-bar.service";

@Component({
    selector: 'io-action-bar',
    templateUrl: 'action-bar.component.html',
    styleUrl: 'action-bar.component.scss',
    standalone: true,
    imports: [],
})
export class ActionBarComponent {
    private actionBarService = inject(ActionBarService);
    
    @Input() isOpen = false;
    @Input() isValid = true;

    @Output() save = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen']) {
            this.actionBarService.setSpace(this.isOpen);
        }
    }

    ngOnDestroy() {
        this.actionBarService.setSpace(false);
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.isOpen) {
            $event.returnValue = true;
        }
    }
}