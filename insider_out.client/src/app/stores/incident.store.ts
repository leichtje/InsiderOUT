import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { IncidentDto, IncidentModel, IncidentStatus } from "../models/incidents.model";
import { TokenType } from "../models/token.model";
import { computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, map, pipe, switchMap, tap } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';

type IncidentState = {
    incidents: IncidentModel[];
    selectedIncident: IncidentModel | null;
    isLoading: boolean;
    error: string | null;
};

const initialState: IncidentState = {
    incidents: [],
    selectedIncident: null,
    isLoading: false,
    error: null,
};

export function toIncidentModel(dto: IncidentDto): IncidentModel {
    return {
        incidentId: dto.incidentId,
        title: dto.title,
        desc: dto.desc,
        date: new Date(dto.date),
        updated: new Date(dto.updated),
        agent: dto.agent,
        tokenId: dto.tokenId,
        tokenType: dto.tokenType.toLowerCase() === 'email' ? TokenType.email : TokenType.document,
        status: dto.status as IncidentStatus, 
        assignedUserId: dto.assignedUserId,
        tiedSubjectId: dto.tiedSubjectId
    };
}

export function toIncidentDto(model: Partial<IncidentModel>): IncidentDto {
    return {
        incidentId: model.incidentId ?? 0,
        title: model.title || '',
        desc: model.desc || '',
        date: model.date ? model.date.toISOString() : new Date().toISOString(),
        updated: model.updated ? model.updated.toISOString() : new Date().toISOString(),
        agent: model.agent || '',
        tokenId: model.tokenId ?? 0,
        tokenType: model.tokenType === TokenType.email ? 'email' : 'document',
        status: model.status?.toString() || IncidentStatus.New.toString(),
        assignedUserId: model.assignedUserId ?? null,
        tiedSubjectId: model.tiedSubjectId ?? null
    };
}

export const IncidentStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withComputed((store) => ({
        incidentCount: computed(() => store.incidents().length),
        hasSelectedIncident: computed(() => !!store.selectedIncident()),
        
        unassignedIncidents: computed(() => 
            store.incidents().filter(inc => inc.assignedUserId === null)
        ),

        entityMap: computed(() => {
            const map: Record<number, IncidentModel> = {};
            for (const incident of store.incidents()) {
                map[incident.incidentId] = incident;
            }
            return map;
        })
    })),

    withMethods((store, http = inject(HttpClient), snackBar = inject(MatSnackBar)) => {
        const apiUrl = 'https://localhost:7244/api/incidents'; 

        return {
            loadAll: rxMethod<void>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap(() => http.get<IncidentDto[]>(apiUrl).pipe(
                        map((dtos) => dtos.map(toIncidentModel)),
                        tap((incidents) => {
                            patchState(store, { 
                                incidents, 
                                isLoading: false 
                            });
                        }),
                        catchError((err) => {
                            console.error('Failed to load incidents:', err);
                            patchState(store, { isLoading: false, error: err.message });
                            return [];
                        })
                    ))
                )
            ),

            create: rxMethod<Omit<IncidentModel, 'incidentId'>>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap((newModel) => {
                        const payload = toIncidentDto(newModel as Partial<IncidentModel>);

                        return http.post<IncidentDto>(apiUrl, payload).pipe(
                            map(toIncidentModel),
                            tap((createdIncident) => {
                                patchState(store, (state) => ({
                                    incidents: [...state.incidents, createdIncident],
                                    isLoading: false
                                }));
                            }),
                            catchError((err) => {
                                console.error('Failed to create incident:', err);
                                patchState(store, { isLoading: false, error: err.message });
                                return [];
                            })
                        );
                    })
                )
            ),

            delete: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap((id) => http.delete(`${apiUrl}/${id}`).pipe(
                        tap(() => {
                            patchState(store, (state) => ({
                                incidents: state.incidents.filter(i => i.incidentId !== id),
                                selectedIncident: state.selectedIncident?.incidentId === id ? null : state.selectedIncident,
                                isLoading: false
                            }));
                        }),
                        catchError((err) => {
                            console.error('Failed to delete incident:', err);
                            patchState(store, { isLoading: false, error: err.message });
                            return [];
                        })
                    ))
                )
            ),

            update: rxMethod<{ id: number; data: IncidentModel }>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap(({ id, data }) => {
                        const payload = toIncidentDto(data);

                        return http.put(`${apiUrl}/${id}`, payload).pipe(
                            tap(() => {
                                patchState(store, (state) => ({
                                    incidents: state.incidents.map(i => i.incidentId === id ? data : i),
                                    selectedIncident: state.selectedIncident?.incidentId === id ? data : state.selectedIncident,
                                    isLoading: false
                                }));

                                snackBar.open('Incident updated successfully', 'Close', {
                                    duration: 5000,
                                    horizontalPosition: 'center',
                                    verticalPosition: 'top',
                                    panelClass: ['snackbar']
                                });
                            }),
                            catchError((err) => {
                                console.error('Failed to update incident:', err);
                                patchState(store, { isLoading: false, error: err.message });
                                
                                snackBar.open('Failed to save changes', 'Retry', { duration: 5000 });
                                
                                return [];
                            })
                        );
                    })
                )
            ),

            selectIncident: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap((id) => {
                        const existing = store.incidents().find(i => i.incidentId === id);
                        if (existing) {
                            patchState(store, { selectedIncident: existing, isLoading: false });
                            return [];
                        }

                        return http.get<IncidentDto>(`${apiUrl}/${id}`).pipe(
                            map(toIncidentModel),
                            tap(incident => patchState(store, { selectedIncident: incident, isLoading: false })),
                            catchError((err) => {
                                console.error('Failed to load incident details:', err);
                                patchState(store, { isLoading: false, error: err.message });
                                return [];
                            })
                        );
                    })
                )
            ),

            clearSelectedIncident() {
                patchState(store, { selectedIncident: null });
            }
        };
    }),
    withHooks({
        onInit(store) {
            store.loadAll(); 
        }
    })
);