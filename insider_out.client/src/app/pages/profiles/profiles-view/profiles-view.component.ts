
import { Component, EventEmitter, input, Output } from '@angular/core';
import { SubjectModel, UserModel } from '../../../models/profile.model';
import { RouterOutlet } from '@angular/router';
import { ProfilesListComponent } from './profiles-list/profiles-list.component';

@Component({
    selector: 'io-profiles-view',
    templateUrl: './profiles-view.component.html',
    styleUrl: './profiles-view.component.scss',
    standalone: true,
    imports: [RouterOutlet, ProfilesListComponent]
})
export class ProfilesViewComponent {

    users = input<UserModel[]>();
    subjects = input<SubjectModel[]>();
    activeId = input<number | null>();
    activeType = input<'user' | 'subject' | null>();
    
    selectedProfile = input<UserModel | SubjectModel | null>();

    @Output() profileSelected = new EventEmitter<UserModel | SubjectModel>();

    onProfileClicked(profile: UserModel | SubjectModel) {
        this.profileSelected.emit(profile);
    }

}
