import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { SubjectModel, UserModel } from '../../../models/person.model';
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
    
    selectedPerson = input<UserModel | SubjectModel | null>();

    @Output() personSelected = new EventEmitter<UserModel | SubjectModel>();

    onPersonClicked(person: UserModel | SubjectModel) {
        this.personSelected.emit(person);
    }

}
