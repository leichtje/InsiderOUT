import { Component, computed, input } from "@angular/core";
import { IncidentModel } from "../../models/incidents.model";

@Component({
    selector: 'io-incidents-heat-map',
    templateUrl: './incidents-heat-map.component.html',
    styleUrl: './incidents-heat-map.component.scss',
    standalone: true,
    imports: []
})
export class IncidentsHeatMapComponent {

    readonly allIncidents$ = input.required<IncidentModel[]>({alias: 'allIncidents'});

    incidentCountsByDay = computed(() => {  
        const allIncidents = this. allIncidents$();
        const counts = new Map<string, number>();

        if (!allIncidents) return counts;

        allIncidents.forEach(incident => {
            const dateString = new Date(incident.date).toISOString().split('T')[0];
            
            const currentCount = counts.get(dateString) || 0;
            counts.set(dateString, currentCount + 1);
        });

        return counts;
    });

    daysInCurrentMonth = computed(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); 
        
        const totalDays = new Date(year, month + 1, 0).getDate(); 
        
        return Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
            return { date: dateString, dayOfMonth: day };
        });
    });

    getColorTier(count: number): string {
        if (count === 0) return 'tier-0'; // No incidents
        if (count <= 2) return 'tier-1';  // Low
        if (count <= 5) return 'tier-2';  // Medium
        return 'tier-3';                  // High
    }

}
