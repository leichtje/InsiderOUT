
import { Component, EventEmitter, inject, input, output, Output } from '@angular/core';
import { SubjectModel, UserModel } from '../../../../models/profile.model';
import { ProfileAvatarComponent } from '../../../../fragments/profile-avatar/profile-avatar.component';
import { UserStore } from '../../../../stores/user.store';
import { SkeletonLoaderComponent } from "../../../../fragments/skeleton-loader/skeleton-loader.component";

@Component({
    selector: 'io-profiles-list',
    templateUrl: './profiles-list.component.html',
    styleUrl: './profiles-list.component.scss',
    standalone: true,
    imports: [ProfileAvatarComponent, SkeletonLoaderComponent]
})
export class ProfilesListComponent {
    protected userStore = inject(UserStore);

    readonly profiles$ = input.required<UserModel[] | SubjectModel[]>({alias: 'profiles'});
    readonly title$ = input.required<string>({alias: 'title'});
    readonly activeId$ = input.required<number | null>({alias: 'activeId'});
    readonly activeType$ = input.required<'user' | 'subject' | null>({alias: 'activeType'});
    readonly listType$ = input.required<'user' | 'subject'>({alias: 'listType'});
    
    readonly profileSelected = output<UserModel | SubjectModel>();

    onSelectProfile(profile: UserModel | SubjectModel) {
        this.profileSelected.emit(profile);
    }

    isActive(profile: UserModel | SubjectModel): boolean {
        
        if (this.activeType$() !== this.listType$()) {
            return false;
        }

        const id = ('userId' in profile) ? profile.userId : profile.subjectId;
        return id === this.activeId$();
    }

}