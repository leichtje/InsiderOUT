import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'io-incidents',
    templateUrl: './incidents.component.html',
    standalone: true,
    imports: [CommonModule, RouterOutlet]
})
export class IncidentsComponent {

}
