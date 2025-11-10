import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { IncidentsOpenViewComponent } from "./incidents-open-view/incidents-open-view.component";
import { IncidentService } from '../../../services/incident.service';
import { IncidentsModel } from '../../../models/incidents.model';

@Component({
    selector: 'io-incidents-open',
    templateUrl: './incidents-open.component.html',
    standalone: true,
    imports: [CommonModule, IncidentsOpenViewComponent]
})
export class IncidentsOpenComponent {

    protected incidentService = inject(IncidentService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    protected incidents = this.incidentService.incidents;

    constructor() {
    }

    onIncidentSelected(incident: IncidentsModel) {
        const id = incident.incidentId;

        this.router.navigate([id], { relativeTo: this.route });
    }

}
