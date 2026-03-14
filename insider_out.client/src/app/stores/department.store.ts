import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, map, mergeMap, pipe, switchMap, tap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DepartmentModel } from "../models/department.model";

type DepartmentState = {
    departments: DepartmentModel[];
    selectedDepartment: DepartmentModel | null;
    isLoading: boolean;
    error: string | null;
};

const initialState: DepartmentState = {
    departments: [],
    selectedDepartment: null,
    isLoading: false,
    error: null,
};

export const DepartmentStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withComputed((store) => ({
        departmentCount: computed(() => store.departments().length),
        hasSelectedDepartment: computed(() => !!store.selectedDepartment()),
        entityMap: computed(() => {
            const map: Record<number, DepartmentModel> = {};
            for (const department of store.departments()) {
                map[department.departmentId] = department;
            }
            return map;
        }),
        
        activeDepartments: computed(() => 
            store.departments().filter(d => d.isActive)
        ),
        
        sortedDepartments: computed(() => 
            [...store.departments()].sort((a, b) => a.sortOrder - b.sortOrder)
        ),
        
        activeSortedDepartments: computed(() => 
            store.departments()
                .filter(d => d.isActive)
                .sort((a, b) => a.sortOrder - b.sortOrder)
        )
    })),

    withMethods((store, http = inject(HttpClient), snackBar = inject(MatSnackBar)) => {
        const apiUrl = 'https://localhost:7244/api/departments'; 

        return {
            loadAll: rxMethod<void>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap(() => http.get<DepartmentModel[]>(apiUrl).pipe(
                        tap((departments) => {
                            patchState(store, { 
                                departments, 
                                isLoading: false 
                            });
                        }),
                        catchError((err) => {
                            console.error('Failed to load departments:', err);
                            patchState(store, { isLoading: false, error: err.message });
                            return [];
                        })
                    ))
                )
            ),

            create: rxMethod<Omit<DepartmentModel, 'departmentId'>>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap((newModel) => {
                        return http.post<DepartmentModel>(apiUrl, newModel).pipe(
                            tap((createdDept) => {
                                patchState(store, (state) => ({
                                    departments: [...state.departments, createdDept],
                                    isLoading: false
                                }));
                            }),
                            catchError((err) => {
                                console.error('Failed to create department:', err);
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
                                departments: state.departments.filter(d => d.departmentId !== id),
                                selectedDepartment: state.selectedDepartment?.departmentId === id ? null : state.selectedDepartment,
                                isLoading: false
                            }));
                        }),
                        catchError((err) => {
                            console.error('Failed to delete department:', err);
                            patchState(store, { isLoading: false, error: err.message });
                            return [];
                        })
                    ))
                )
            ),

            update: rxMethod<{ id: number; data: DepartmentModel }>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    mergeMap(({ id, data }) => {
                        return http.put(`${apiUrl}/${id}`, data).pipe(
                            tap(() => {
                                patchState(store, (state) => ({
                                    departments: state.departments.map(i => i.departmentId === id ? data : i),
                                    selectedDepartment: state.selectedDepartment?.departmentId === id ? data : state.selectedDepartment,
                                    isLoading: false
                                }));

                                snackBar.open('Department updated successfully', 'Close', {
                                    duration: 5000,
                                    horizontalPosition: 'center',
                                    verticalPosition: 'top',
                                    panelClass: ['snackbar']
                                });
                            }),
                            catchError((err) => {
                                console.error('Failed to update department:', err);
                                patchState(store, { isLoading: false, error: err.message });
                                
                                snackBar.open('Failed to save changes', 'Retry', { duration: 5000 });
                                
                                return [];
                            })
                        );
                    })
                )
            ),

            selectDepartment: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap((id) => {
                        const existing = store.departments().find(d => d.departmentId === id);
                        if (existing) {
                            patchState(store, { selectedDepartment: existing, isLoading: false });
                            return [];
                        }

                        return http.get<DepartmentModel>(`${apiUrl}/${id}`).pipe(
                            tap(department => patchState(store, { selectedDepartment: department, isLoading: false })),
                            catchError((err) => {
                                console.error('Failed to load department details:', err);
                                patchState(store, { isLoading: false, error: err.message });
                                return [];
                            })
                        );
                    })
                )
            ),
            
            loadDepartment: rxMethod<number>(
                pipe(
                    switchMap((id) => {
                        if (store.entityMap()[id]) {
                            return []; 
                        }

                        return http.get<DepartmentModel>(`${apiUrl}/${id}`).pipe(
                            tap((department) => {
                                patchState(store, (state) => ({
                                    departments: [...state.departments, department] 
                                }));
                            }),
                            catchError((err) => {
                                console.error(`Failed to load missing department ${id}:`, err);
                                return [];
                            })
                        );
                    })
                )
            ),

            clearSelectedDepartment() {
                patchState(store, { selectedDepartment: null });
            }
        };
    }),
    withHooks({
        onInit(store) {
            store.loadAll(); 
        }
    })
);