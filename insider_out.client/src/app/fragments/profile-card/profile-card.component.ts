import { Component, input } from '@angular/core';

import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';

@Component({
    selector: 'io-profile-card',
    standalone: true,
    imports: [ProfileAvatarComponent],
    templateUrl: './profile-card.component.html',
    styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
    profile = input.required<any>();
}