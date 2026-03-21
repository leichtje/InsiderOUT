import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { DepartmentStore } from "./department.store";
import { IncidentStore } from "./incident.store";
import { UserStore } from "./user.store";
import { SubjectStore } from "./subject.store";
import { DocumentStore } from "./documents.store";
import { computed, effect, inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, tap } from "rxjs";

type LocalDetailState = {
    
};

export const DashboardStore = signalStore(
    // withState<LocalDetailState>({ id: null }),

    withComputed((
        state,
        incidentStore = inject(IncidentStore),
        userStore = inject(UserStore),
        subjectStore = inject(SubjectStore),
        documentStore = inject(DocumentStore),
        departmentStore = inject(DepartmentStore)
    ) => {

        const overallRisk = computed(() => {
            const subjects = subjectStore.subjects();

            if (subjects.length == 0 || !subjects) {
                return;
            }

            const totalRisk = subjects.reduce((sum, subject) => {
                return sum + subject.riskScore;
            }, 0)

            return Math.round(totalRisk / subjects.length);
        })

        const mostRecentIncidents = computed(() => {
            const sortedIncidents = incidentStore.sortedIncidents();
            console.log( sortedIncidents)
            return sortedIncidents.slice(0, 10);
        })

        const assignedIncidents = computed(() => {
            const currentUser = userStore.currentUser();
            const sortedIncidents = incidentStore.sortedIncidents();

            if (sortedIncidents.length == 0 || !sortedIncidents) {
                return [];
            }

            return sortedIncidents 
                .filter(i => i.assignedUserId === currentUser?.userId)
        })


        const isLoading = computed(() => 
            incidentStore.isLoading() || 
            userStore.isLoading() || 
            subjectStore.isLoading() || 
            documentStore.isLoading() || 
            departmentStore.isLoading()
        );

        return {
            isLoading,
            overallRisk,
            mostRecentIncidents,
            assignedIncidents,
        };
    }),

    withMethods((
        state, 
        incidentStore = inject(IncidentStore),
        userStore = inject(UserStore),
        subjectStore = inject(SubjectStore),
        documentStore = inject(DocumentStore),
        departmentStore = inject(DepartmentStore)
    ) => ({
        loadDashboard: rxMethod<number>(
            pipe(
                tap((id) => {
                    patchState(state, { incidentId: id });
                    
                    incidentStore.selectIncident(id);
                })
            )
        ),
        
        clear: () => incidentStore.clearSelectedIncident()
    })),

    withHooks({
        onInit(store) {
            const userStore = inject(UserStore);
            const subjectStore = inject(SubjectStore);
            const documentStore = inject(DocumentStore);

            effect(() => {

                
            });
        },  
        onDestroy(store) {
            store.clear();
        }
    })


);