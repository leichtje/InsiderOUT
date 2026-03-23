import { Component, computed, input, signal } from "@angular/core";
import { IncidentModel } from "../../models/incidents.model";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";

export interface CalendarCell {
    id: string;
    isPadding: boolean;
    date?: string;
    dayOfMonth?: number;
}
@Component({
    selector: 'io-incidents-heat-map',
    templateUrl: './incidents-heat-map.component.html',
    styleUrl: './incidents-heat-map.component.scss',
    standalone: true,
    imports: [MatIcon, MatTooltip, RouterLink, DatePipe]
})
export class IncidentsHeatMapComponent {

    readonly allIncidents$ = input.required<IncidentModel[]>({alias: 'allIncidents'});

    viewingYear = signal(new Date().getFullYear());
    viewingMonth = signal(new Date().getMonth());

    incidentCountsByDay = computed(() => {  
        const allIncidents = this.allIncidents$();
        const counts = new Map<string, number>();

        if (!allIncidents) return counts;

        allIncidents.forEach(incident => {
            const dateString = new Date(incident.date).toISOString().split('T')[0];
            const currentCount = counts.get(dateString) || 0;
            counts.set(dateString, currentCount + 1);
        });

        return counts;
    });

    getColorTier(count: number): string {
        if (count === 0) return 'tier-0'; // No incidents
        if (count <= 2) return 'tier-1 incidents';  // Low
        if (count <= 5) return 'tier-2 incidents';  // Medium
        return 'tier-3 incidents';                  // High
    }

    getToolTipText(date: string): string {
        const count = this.incidentCountsByDay().get(date) || 0;

        return count === 1 ? '1 incident' : `${count} incidents`
    }

    weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    currentMonthName = computed(() => {
        const date = new Date(this.viewingYear(), this.viewingMonth(), 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    });

    calendarGrid = computed<CalendarCell[]>(() => {
        const year = this.viewingYear();
        const month = this.viewingMonth();

        const firstDayOfWeek = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        const paddingDays: CalendarCell[] = Array.from({ length: firstDayOfWeek }, (_, i) => ({
            id: `pad-${i}`, 
            isPadding: true 
        }));

        const actualDays: CalendarCell[] = Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            return { 
                id: `day-${dateString}`, 
                isPadding: false,
                date: dateString, 
                dayOfMonth: day 
            };
        });

        return [...paddingDays, ...actualDays];
    });

    selectedDate = signal<string | null>(null);

    selectedDayIncidents = computed(() => {
        const date = this.selectedDate();
        if (!date) return [];

        const all = this.allIncidents$();
        if (!all) return [];

        return all.filter(incident => {
            const incidentDateString = new Date(incident.date).toISOString().split('T')[0];
            return incidentDateString === date;
        });
    });


    previousMonth() {
        if (this.viewingMonth() === 0) {
            this.viewingMonth.set(11);
            this.viewingYear.update(year => year - 1);
        } else {
            this.viewingMonth.update(month => month - 1);
        }
    }

    nextMonth() {
        if (this.viewingMonth() === 11) {
            this.viewingMonth.set(0);
            this.viewingYear.update(year => year + 1);
        } else {
            this.viewingMonth.update(month => month + 1);
        }
    }

    isCurrentMonth = computed(() => {
        const now = new Date();
        return this.viewingYear() === now.getFullYear() && 
            this.viewingMonth() === now.getMonth();
    });

    goToCurrentMonth() {
        const now = new Date();
        this.viewingYear.set(now.getFullYear());
        this.viewingMonth.set(now.getMonth());
    }

    onDayClick(date: string | undefined, count: number) {
        if (date && count > 0) {
            this.selectedDate.update(current => current === date ? null : date);
        }
    }

}

