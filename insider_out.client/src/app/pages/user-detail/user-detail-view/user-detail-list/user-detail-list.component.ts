import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { SubjectModel, UserModel } from '../../../../models/person.model';
import { UserAvatarComponent } from "../../../../fragments/avatar/avatar.component";

@Component({
    selector: 'io-user-detail-list',
    templateUrl: './user-detail-list.component.html',
    styleUrl: './user-detail-list.component.scss',
    standalone: true,
    imports: [CommonModule, UserAvatarComponent]
})
export class UserDetailListComponent {

    people = input<UserModel[] | SubjectModel[]>();
    title = input<string>();
    @Output() personSelected = new EventEmitter<UserModel | SubjectModel>();

    activeId = input<number | null>();
    activeType = input<'user' | 'subject' | null>();
    listType = input<'user' | 'subject'>();

    onSelectPerson(person: UserModel | SubjectModel) {
        this.personSelected.emit(person);
    }

    isActive(person: UserModel | SubjectModel): boolean {
        
        if (this.activeType() !== this.listType()) {
        return false;
        }

        const id = ('userId' in person) ? person.userId : person.subjectId;
        return id === this.activeId();
    }

}