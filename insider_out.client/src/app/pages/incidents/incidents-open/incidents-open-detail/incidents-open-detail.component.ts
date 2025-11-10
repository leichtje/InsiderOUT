import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { IncidentService } from '../../../../services/incident.service';

@Component({
    selector: 'io-incidents-open-detail',
    templateUrl: './incidents-open-detail.component.html',
    styleUrl: './incidents-open-detail.component.scss',
    standalone: true,
    imports: [CommonModule]
})
export class IncidentsOpenDetailComponent {

    private route = inject(ActivatedRoute);
    protected incidentService = inject(IncidentService);

    protected activeId = signal<number | null>(null);

    incident$ = this.route.paramMap.pipe(
        switchMap(params => {
            const id = +params.get('id')!;
            const type = this.route.snapshot.url[0].path; 
            
            return this.incidentService.getIncidentById(id);
        })
    );


}