import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { SubjectModel, UserModel } from '../../../models/profile.model';
import { UserDetailListComponent } from "./user-detail-list/user-detail-list.component";
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'io-user-detail-view',
    templateUrl: './user-detail-view.component.html',
    styleUrl: './user-detail-view.component.scss',
    standalone: true,
    imports: [CommonModule, UserDetailListComponent, RouterOutlet]
})
export class UserDetailViewComponent {

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
