
import { Component, EventEmitter, inject, input, output, Output } from '@angular/core';
import { SubjectModel, UserModel } from '../../../models/profile.model';
import { RouterOutlet } from '@angular/router';
import { ProfilesListComponent } from './profiles-list/profiles-list.component';
import { UserStore } from '../../../stores/user.store';
import { SubjectStore } from '../../../stores/subject.store';

@Component({
    selector: 'io-profiles-view',
    templateUrl: './profiles-view.component.html',
    styleUrl: './profiles-view.component.scss',
    standalone: true,
    imports: [RouterOutlet, ProfilesListComponent]
})
export class ProfilesViewComponent {
    protected userStore = inject(UserStore);
    protected subjectStore = inject(SubjectStore);

    readonly users$ = input.required<UserModel[]>({alias: 'users'});
    readonly subjects$ = input.required<SubjectModel[]>({alias: 'subjects'});
    readonly activeId$ = input.required<number | null>({alias: 'activeId'});
    readonly activeType$ = input.required<'user' | 'subject' | null>({alias: 'activeType'});
    readonly selectedProfile = input<UserModel | SubjectModel | null>();
    
    readonly profileSelected = output<UserModel | SubjectModel>();
    readonly create = output<void>();
    
    onProfileClicked(profile: UserModel | SubjectModel) {
        this.profileSelected.emit(profile);
    }

    onCreate() {
        this.create.emit();
    }

}
