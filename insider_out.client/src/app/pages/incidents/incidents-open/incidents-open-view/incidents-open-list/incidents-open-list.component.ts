import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { ProfileAvatarComponent } from '../../../../../fragments/profile-avatar/profile-avatar.component';
import { UserService } from '../../../../../services/user.service';
import { IncidentModel } from '../../../../../models/incidents.model';
import { TokenType } from '../../../../../models/token.model';

@Component({
    selector: 'io-incidents-open-list',
    templateUrl: './incidents-open-list.component.html',
    styleUrl: './incidents-open-list.component.scss',
    standalone: true,
    imports: [CommonModule, ProfileAvatarComponent]
})
export class IncidentsOpenListComponent {

    protected userService = inject(UserService);
    protected tokenType = TokenType;

    incidents = input<IncidentModel[]>();

    @Output() incidentSelected = new EventEmitter<IncidentModel>();

    onSelectIncident(incident: IncidentModel) {
        this.incidentSelected.emit(incident);
    }

}