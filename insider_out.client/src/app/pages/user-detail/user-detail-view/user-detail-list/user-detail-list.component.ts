import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { SubjectModel, UserModel } from '../../../../models/profile.model';
import { UserAvatarComponent } from "../../../../fragments/avatar/avatar.component";

@Component({
    selector: 'io-user-detail-list',
    templateUrl: './user-detail-list.component.html',
    styleUrl: './user-detail-list.component.scss',
    standalone: true,
    imports: [CommonModule, UserAvatarComponent]
})
export class UserDetailListComponent {

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