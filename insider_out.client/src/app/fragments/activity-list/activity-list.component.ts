import { Component, inject, input, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivityService } from '../../services/activity.service';
import { ActivityScope } from '../../models/activity.model';
import { UserModel } from '../../models/profile.model';
import { ProfileAvatarComponent } from "../profile-avatar/profile-avatar.component";
import { UserStore } from '../../stores/user.store';

@Component({
    selector: 'io-activity-list',
    standalone: true,
    imports: [CommonModule, DatePipe, ProfileAvatarComponent],
    templateUrl: './activity-list.component.html',
    styleUrl: './activity-list.component.scss'
})
export class ActivityListComponent {
    private activityService = inject(ActivityService);
    
    protected userStore = inject(UserStore); 

    entityId = input.required<number>(); 
    entityType = input.required<ActivityScope>();

    currentActivities = computed(() => {
        const all = this.activityService.activities();
        const id = this.entityId();
        const type = this.entityType();

        return all
            .filter(a => a.entityId === id && a.entityType === type)
            .sort((a, b) => b.date.getTime() - a.date.getTime());
    });

    private userMap = computed(() => {
        const users = this.userStore.users();
        return new Map(users.map(u => [u.userId, u]));
    });

    getUserName(userId: number | null): string {
        if (!userId) return 'System';
        
        const user = this.userMap().get(userId);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
    }

    getUser(userId: number | null): UserModel | undefined {
        if (!userId) return undefined;
        return this.userMap().get(userId);
    }
}