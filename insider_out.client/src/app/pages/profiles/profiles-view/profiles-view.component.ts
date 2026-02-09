
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

    readonly users$ = input.required<UserModel[]>({alias: 'users'});
    readonly subjects$ = input.required<SubjectModel[]>({alias: 'subjects'});
    readonly activeId$ = input.required<number | null>({alias: 'activeId'});
    readonly activeType$ = input.required<'user' | 'subject' | null>({alias: 'activeType'});
    
    selectedProfile = input<UserModel | SubjectModel | null>();

    @Output() profileSelected = new EventEmitter<UserModel | SubjectModel>();

    onProfileClicked(profile: UserModel | SubjectModel) {
        this.profileSelected.emit(profile);
    }

}
