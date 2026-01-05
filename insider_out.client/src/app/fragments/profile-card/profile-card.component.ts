import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';

@Component({
    selector: 'io-profile-card',
    standalone: true,
    imports: [CommonModule, ProfileAvatarComponent],
    templateUrl: './profile-card.component.html',
    styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
    profile = input.required<any>();
}