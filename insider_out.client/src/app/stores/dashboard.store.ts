import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { DepartmentStore } from "./department.store";
import { IncidentStore } from "./incident.store";
import { UserStore } from "./user.store";
import { SubjectStore } from "./subject.store";
import { DocumentStore } from "./documents.store";
import { computed, effect, inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, tap } from "rxjs";
import { IncidentModel } from "../models/incidents.model";

type LocalDetailState = {
    
};

export interface DepartmentDashboards {
    departmentId: number;
    departmentName: string; 
    averageRiskScore: number;
    recentIncidents: IncidentModel[];
    totalSubjects: number;
}

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

        const overallCompanyRisk = computed(() => {
            const subjects = subjectStore.subjects();

            if (subjects.length == 0 || !subjects) {
                return 0;
            }

            const totalRisk = subjects.reduce((sum, subject) => {
                return sum + subject.riskScore;
            }, 0)

            return Math.round(totalRisk / subjects.length);
        })

        const overallDepartmentRisk = computed(() => {
            const dashboards = departmentDashboards();

            if (!dashboards || dashboards.length === 0) {
                return 0;
            }

            const totalDepartmentRisk = dashboards.reduce((sum, dept) => {
                return sum + dept.averageRiskScore;
            }, 0);

            return Math.round(totalDepartmentRisk / dashboards.length);
        });

        const recentIncidents = computed(() => {
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


        const departmentDashboards = computed<DepartmentDashboards[]>(() => {
            const allDepartments = departmentStore.departments();
            const allSubjects = subjectStore.subjects();
            const allIncidents = incidentStore.incidents();

            if (!allDepartments || !allSubjects || !allIncidents) return [];

            return allDepartments.map(department => {
                const deptSubjects = allSubjects.filter(sub => sub.department === department.department);

                let averageRisk = 0;

                if (deptSubjects.length > 0) {
                    const totalRisk = deptSubjects.reduce((sum, sub) => sum + sub.riskScore, 0);
                    averageRisk = totalRisk / deptSubjects.length;
                }

                const deptSubjectIds = deptSubjects.map(sub => sub.subjectId);

                const recentIncidents = allIncidents
                    .filter(incident => deptSubjectIds.includes(incident.tiedSubjectId ?? 0))
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10);

                return {
                    departmentId: department.departmentId,
                    departmentName: department.department ?? '',
                    averageRiskScore: averageRisk,
                    recentIncidents: recentIncidents,
                    totalSubjects: deptSubjects.length
                };
            });
        });

        const isLoading = computed(() => 
            incidentStore.isLoading() || 
            userStore.isLoading() || 
            subjectStore.isLoading() || 
            documentStore.isLoading() || 
            departmentStore.isLoading()
        );

        return {
            isLoading,
            overallCompanyRisk,
            overallDepartmentRisk,
            recentIncidents,
            assignedIncidents,
            departmentDashboards,
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