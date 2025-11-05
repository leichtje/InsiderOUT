import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { SubjectModel, UserModel } from '../../../../models/profile.model';
import { ProfileAvatarComponent } from '../../../../fragments/profile-avatar/profile-avatar.component';
import { UserService } from '../../../../services/user.service';

@Component({
    selector: 'io-profiles-list',
    templateUrl: './profiles-list.component.html',
    styleUrl: './profiles-list.component.scss',
    standalone: true,
    imports: [CommonModule, ProfileAvatarComponent]
})
export class ProfilesListComponent {

    protected userService = inject(UserService);

    profiles = input<UserModel[] | SubjectModel[]>();
    title = input<string>();
    @Output() profileSelected = new EventEmitter<UserModel | SubjectModel>();

    activeId = input<number | null>();
    activeType = input<'user' | 'subject' | null>();
    listType = input<'user' | 'subject'>();

    onSelectProfile(profile: UserModel | SubjectModel) {
        this.profileSelected.emit(profile);
    }

    isActive(profile: UserModel | SubjectModel): boolean {
        
        if (this.activeType() !== this.listType()) {
        return false;
        }

        const id = ('userId' in profile) ? profile.userId : profile.subjectId;
        return id === this.activeId();
    }

}