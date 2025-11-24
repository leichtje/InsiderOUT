import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { IncidentsOpenViewComponent } from "./incidents-open-view/incidents-open-view.component";
import { IncidentService } from '../../../services/incident.service';
import { IncidentModel } from '../../../models/incidents.model';
import { FilterValue } from '../../../models/filter.model';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'io-incidents-open',
    templateUrl: './incidents-open.component.html',
    standalone: true,
    imports: [CommonModule, IncidentsOpenViewComponent]
})
export class IncidentsOpenComponent {

    protected incidentService = inject(IncidentService);
    protected userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private allIncidents = this.incidentService.incidents;

    protected currentFilter = signal<FilterValue>('all');

    protected filteredIncidents = computed(() => {
        const incidents = this.allIncidents();
        const filter = this.currentFilter();
        const currentUser = this.userService.currentUser();

        switch (filter) {
            case 'mine':
                return incidents.filter(i => i.assignedUserId === currentUser.userId);
            
            case 'unassigned':
                return incidents.filter(i => !i.assignedUserId);
            
            case 'all':
            default:
                return incidents;
        }
    });

    onFilterChange(newFilter: FilterValue) {
        this.currentFilter.set(newFilter);
    }

    onIncidentSelected(incident: IncidentModel) {
        const id = incident.incidentId;

        this.router.navigate([id], { relativeTo: this.route });
    }

}
