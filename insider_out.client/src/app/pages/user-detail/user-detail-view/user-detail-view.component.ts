import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';

@Component({
    selector: 'io-user-detail-view',
    templateUrl: './user-detail-view.component.html',
    styleUrl: './user-detail-view.component.scss',
    standalone: true,
    imports: [CommonModule]
})
export class UserViewComponent {

    userId = input<string | null>();


}
