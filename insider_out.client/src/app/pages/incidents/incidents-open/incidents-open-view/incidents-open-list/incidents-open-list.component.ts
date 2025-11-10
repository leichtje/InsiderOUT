import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { ProfileAvatarComponent } from '../../../../../fragments/profile-avatar/profile-avatar.component';
import { UserService } from '../../../../../services/user.service';
import { IncidentsModel } from '../../../../../models/incidents.model';

@Component({
    selector: 'io-incidents-open-list',
    templateUrl: './incidents-open-list.component.html',
    styleUrl: './incidents-open-list.component.scss',
    standalone: true,
    imports: [CommonModule, ProfileAvatarComponent]
})
export class IncidentsOpenListComponent {

    protected userService = inject(UserService);

    incidents = input<IncidentsModel[]>();

    @Output() incidentSelected = new EventEmitter<IncidentsModel>();

    onSelectIncident(incident: IncidentsModel) {
        this.incidentSelected.emit(incident);
    }

}