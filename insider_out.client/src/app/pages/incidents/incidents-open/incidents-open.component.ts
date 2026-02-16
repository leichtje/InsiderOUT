
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { IncidentsOpenViewComponent } from "./incidents-open-view/incidents-open-view.component";
import { IncidentService } from '../../../services/incident.service';
import { IncidentModel } from '../../../models/incidents.model';
import { FilterValue } from '../../../models/filter.model';
import { UserService } from '../../../services/user.service';
import { TokenType } from '../../../models/token.model';

@Component({
    selector: 'io-incidents-open',
    templateUrl: './incidents-open.component.html',
    standalone: true,
    imports: [IncidentsOpenViewComponent]
})
export class IncidentsOpenComponent {

    protected incidentService = inject(IncidentService);
    protected userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private allIncidents = this.incidentService.incidents;

    protected currentUserFilter = signal<FilterValue>('all');
    protected currentTypeFilter = signal<FilterValue>('all');

    protected filteredIncidents = computed(() => {
        const incidents = this.allIncidents();
        const userFilter = this.currentUserFilter();
        const typeFilter = this.currentTypeFilter();
        const currentUser = this.userService.currentUser();
        
        let result = incidents; 

        return result;

        // switch (userFilter) {
        //     case 'mine':
        //         result = result.filter(i => i.assignedUserId === currentUser?.userId);
        //         break;
            
        //     case 'unassigned':
        //         result = result.filter(i => !i.assignedUserId);
        //         break;            
            
        //     case 'all':
        //     default:
        //         break;
        // }

        // switch (typeFilter) {
        //     case 'document':
        //         return result.filter(i => i.tokenType === TokenType.document);
            
        //     case 'email':
        //         return result.filter(i => i.tokenType === TokenType.email);
            
        //     case 'all':
        //     default:
        //         return result;
        // }
    });

    onUserFilterChange(newFilter: FilterValue) {
        this.currentUserFilter.set(newFilter);
    }

    onTypeFilterChange(newFilter: FilterValue) {
        this.currentTypeFilter.set(newFilter);
    }

    onIncidentSelected(incident: IncidentModel) {
        const id = incident.incidentId;

        this.router.navigate([id], { relativeTo: this.route });
    }

}
