import { Component, input } from '@angular/core';

import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';
import { ProfileModel, SubjectModel, UserModel } from '../../models/profile.model';

@Component({
    selector: 'io-profile-card',
    standalone: true,
    imports: [ProfileAvatarComponent],
    templateUrl: './profile-card.component.html',
    styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
    readonly profile$ = input.required<any>({alias: 'profile'});
}