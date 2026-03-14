
import { Component, computed, inject, signal } from '@angular/core';
import { IncidentStore } from '../../../stores/incident.store';
import { UserStore } from '../../../stores/user.store';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterValue } from '../../../models/filter.model';
import { TokenType } from '../../../models/token.model';
import { IncidentModel } from '../../../models/incidents.model';
import { IncidentsClosedViewComponent } from "./incidents-closed-view/incidents-closed-view.component";

@Component({
    selector: 'io-incidents-closed',
    templateUrl: './incidents-closed.component.html',
    styleUrl: './incidents-closed.component.scss',
    standalone: true,
    imports: [IncidentsClosedViewComponent]
})
export class IncidentsClosedComponent {

    protected incidentStore = inject(IncidentStore);
    protected userStore = inject(UserStore);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private allInActiveIncidents = this.incidentStore.InActiveIncidents;

    protected currentUserFilter = signal<FilterValue>('all');
    protected currentTypeFilter = signal<FilterValue>('all');

    protected filteredIncidents = computed(() => {
        const incidents = this.allInActiveIncidents();
        const userFilter = this.currentUserFilter();
        const typeFilter = this.currentTypeFilter();
        const currentUser = this.userStore.currentUser();
        
        let result = incidents; 

        switch (userFilter) {
            case 'mine':
                result = result.filter(i => i.assignedUserId === currentUser?.userId);
                break;
            
            case 'unassigned':
                result = result.filter(i => !i.assignedUserId);
                break;            
            
            case 'all':
            default:
                break;
        }

        switch (typeFilter) {
            case 'document':
                return result.filter(i => i.tokenType === TokenType.document);
            
            case 'email':
                return result.filter(i => i.tokenType === TokenType.email);
            
            case 'all':
            default:
                return result;
        }
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
